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

    const numericAmount = Number(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount. Amount must be greater than 0." },
        { status: 400 }
      )
    }

    // PayPal supported currencies: AUD, CAD, EUR, GBP, USD, etc.
    // PayPal does NOT support domestic INR transactions for Indian merchants.
    // Catalog product base prices in database are stored in USD.
    let chargeCurrency = "USD"
    let chargeAmount = numericAmount

    if (currency === "EUR") {
      chargeCurrency = "EUR"
      chargeAmount = Number((numericAmount * 0.92).toFixed(2))
    } else if (currency === "GBP") {
      chargeCurrency = "GBP"
      chargeAmount = Number((numericAmount * 0.79).toFixed(2))
    } else if (currency === "INR") {
      chargeCurrency = "USD"
      // If amount passed is already in INR (e.g. ₹8,267 or > 500), convert back to USD:
      if (numericAmount > 500) {
        chargeAmount = Number((numericAmount / 83.5).toFixed(2))
      } else {
        // Base USD catalog price (e.g. $99, $105, or test item $0.02)
        chargeAmount = Number(numericAmount.toFixed(2))
      }
    } else {
      chargeCurrency = "USD"
      chargeAmount = Number(numericAmount.toFixed(2))
    }

    // PayPal requires minimum value 0.01 and strictly 2 decimal places
    if (chargeAmount < 0.01) {
      chargeAmount = 0.01
    }

    const valueString = chargeAmount.toFixed(2)

    const accessToken = await getPayPalAccessToken()
    const baseUrl = getPayPalBaseUrl()

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: chargeCurrency,
            value: valueString,
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
      let errorMessage = order.message || "Failed to create PayPal order"
      if (order.details && order.details.length > 0) {
        const issue = order.details[0].issue
        const desc = order.details[0].description
        if (issue === "PAYEE_ACCOUNT_RESTRICTED") {
          errorMessage = "PayPal merchant account is currently restricted by PayPal. Please complete business verification (KYC/PAN) on your PayPal dashboard."
        } else if (desc) {
          errorMessage = desc
        }
      }
      return NextResponse.json(
        { error: errorMessage, raw: order },
        { status: response.status || 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      chargeCurrency,
      chargeAmount: valueString,
    })
  } catch (error: any) {
    console.error("PayPal create-order route error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
