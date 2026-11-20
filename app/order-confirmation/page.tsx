"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Mail, Home, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/components/currency-context"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Customer {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface Shipping {
  address: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Payment {
  method: string
  last4?: string
  transactionId?: string
  payerEmail?: string
}

interface Totals {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

interface OrderData {
  _id?: string
  orderId: string
  items: OrderItem[]
  customer: Customer
  shipping: Shipping
  payment: Payment
  totals: Totals
  notes?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt?: string
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'N/A'
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { formatPrice } = useCurrency()

  useEffect(() => {
    if (orderId && orderId !== 'N/A') {
      fetchOrderDetails()
    } else {
      setLoading(false)
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)

      // Check session storage first for instant display
      if (typeof window !== "undefined") {
        try {
          const cached = sessionStorage.getItem("last_placed_order")
          if (cached) {
            const parsed = JSON.parse(cached)
            if (parsed.orderId === orderId) {
              setOrderData(parsed)
            }
          }
        } catch (e) {}
      }

      const response = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`)
      const data = await response.json()
      
      if (data.success && (data.order || (data.orders && data.orders.length > 0))) {
        const order = data.order || data.orders.find((o: OrderData) => o.orderId === orderId) || data.orders[0]
        if (order) {
          setOrderData(order)
        }
      }
    } catch (error) {
      console.warn("Using fallback/cached order display:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fallback data if order not found or still loading
  const fallbackData = {
    orderId: orderId,
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    items: [
      {
        name: "Classic Walnut Leather Jacket",
        price: 480,
        quantity: 1,
        image: "/classic-walnut-leather-rider-jacket-studio.jpg"
      }
    ],
    shipping: {
      name: "Customer",
      address: "Delivery Address Provided",
      city: "City",
      state: "State",
      zipCode: "",
      country: "United States"
    },
    totals: {
      subtotal: 480,
      tax: 0,
      shipping: 0,
      total: 480
    }
  }

  const displayData = orderData || fallbackData

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40">
      <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16 py-20">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="features-gradient">Order Confirmed!</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          {loading && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading latest order status...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Number</span>
                  <Badge variant="outline" className="font-mono">#{displayData.orderId}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{orderData ? new Date(orderData.createdAt).toLocaleDateString() : fallbackData.orderDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Method</span>
                  <Badge className="bg-amber-100 text-amber-900 border border-amber-300 capitalize">
                    {orderData?.payment?.method ? orderData.payment.method.replace('_', ' ') : 'Direct Order'}
                  </Badge>
                </div>
                {orderData && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{orderData ? `${orderData.customer.firstName} ${orderData.customer.lastName}` : fallbackData.shipping.name}</p>
                  <p>{orderData ? orderData.shipping.address : displayData.shipping.address}</p>
                  {orderData && orderData.shipping.apartment && <p>{orderData.shipping.apartment}</p>}
                  <p>{orderData ? `${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}` : `${displayData.shipping.city}, ${displayData.shipping.state} ${displayData.shipping.zipCode}`}</p>
                  <p>{orderData ? orderData.shipping.country : displayData.shipping.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Contact */}
            {orderData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{orderData.customer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{orderData.customer.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(displayData.totals.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(displayData.totals.tax)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(displayData.totals.total)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/shop" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Continue Shopping
                    </Button>
                  </Link>
                  
                  <Link href="/" className="block">
                    <Button className="w-full" variant="outline">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Questions about your order?<br />
                    <Link href="/contact" className="text-primary hover:underline">
                      Contact our support team
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your order confirmation...</p>
        </div>
      </main>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
