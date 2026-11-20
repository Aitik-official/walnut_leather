import { NextRequest, NextResponse } from "next/server"

function getPayPalBaseUrl(): string {
  const mode = process.env.PAYPAL_MODE || "live"
  return mode === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com"
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured in environment variables.")
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const baseUrl = getPayPalBaseUrl()

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error_description || "Failed to authenticate with PayPal")
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "INR" } = body

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 }
      )
    }

    // PayPal supported currencies: AUD, CAD, EUR, GBP, USD, etc.
    // PayPal does NOT support domestic INR transactions.
    // If currency is INR, we convert to USD for PayPal processing.
    let chargeCurrency = currency
    let chargeAmount = Number(amount)

    if (currency === "INR") {
      chargeCurrency = "USD"
      // Convert INR to USD (83.5 INR = 1 USD)
      chargeAmount = Number((Number(amount) / 83.5).toFixed(2))
    } else {
      chargeAmount = Number(Number(amount).toFixed(2))
    }

    const accessToken = await getPayPalAccessToken()
    const baseUrl = getPayPalBaseUrl()

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: chargeCurrency,
            value: chargeAmount.toFixed(2),
          },
          description: "Walnut Leather - Handcrafted Leather Apparel",
        },
      ],
      application_context: {
        brand_name: "Walnut Leather",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    })

    const order = await response.json()

    if (!response.ok || !order.id) {
      console.error("PayPal order creation error:", order)
      return NextResponse.json(
        { error: order.message || "Failed to create PayPal order" },
        { status: response.status || 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      chargeCurrency,
      chargeAmount,
    })
  } catch (error: any) {
    console.error("PayPal create-order route error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
