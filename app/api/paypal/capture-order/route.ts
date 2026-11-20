import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase, COLLECTIONS } from "@/lib/mongodb"

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
    const { paypalOrderId, orderData } = body

    if (!paypalOrderId) {
      return NextResponse.json(
        { error: "Missing PayPal Order ID" },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()
    const baseUrl = getPayPalBaseUrl()

    // Capture the payment through PayPal API
    const captureResponse = await fetch(
      `${baseUrl}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    const captureData = await captureResponse.json()

    if (!captureResponse.ok || captureData.status !== "COMPLETED") {
      console.error("PayPal capture error:", captureData)
      return NextResponse.json(
        {
          error:
            captureData.message ||
            captureData.details?.[0]?.description ||
            "Payment capture failed or was not completed",
        },
        { status: captureResponse.status || 500 }
      )
    }

    // Extract PayPal transaction and payer info
    const purchaseUnit = captureData.purchase_units?.[0]
    const capture = purchaseUnit?.payments?.captures?.[0]
    const captureId = capture?.id || paypalOrderId
    const payerEmail = captureData.payer?.email_address || orderData?.customer?.email || ""
    const payerName = captureData.payer?.name
      ? `${captureData.payer.name.given_name || ""} ${captureData.payer.name.surname || ""}`.trim()
      : ""

    // Generate internal order ID
    const internalOrderId = `WL${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Construct final order object
    const finalOrder = {
      orderId: internalOrderId,
      items: orderData?.items || [],
      customer: {
        firstName: orderData?.customer?.firstName || captureData.payer?.name?.given_name || "Customer",
        lastName: orderData?.customer?.lastName || captureData.payer?.name?.surname || "",
        email: orderData?.customer?.email || payerEmail,
        phone: orderData?.customer?.phone || "",
      },
      shipping: orderData?.shipping || {
        address: "Address Provided at Checkout",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      },
      payment: {
        method: "paypal",
        status: "COMPLETED",
        transactionId: captureId,
        paypalOrderId,
        payerEmail,
        payerName,
        capturedAmount: capture?.amount?.value,
        capturedCurrency: capture?.amount?.currency_code,
        last4: "PayPal",
      },
      totals: orderData?.totals || {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      },
      notes: orderData?.notes || "",
      status: "confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to MongoDB
    const { db } = await connectToDatabase()
    const ordersCollection = db.collection(COLLECTIONS.ORDERS)
    await ordersCollection.insertOne(finalOrder)

    return NextResponse.json({
      success: true,
      orderId: internalOrderId,
      captureId,
      order: finalOrder,
      message: "Payment captured and order placed successfully",
    })
  } catch (error: any) {
    console.error("PayPal capture-order route error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
