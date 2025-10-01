"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Mail, Home, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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
  last4: string
}

interface Totals {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

interface OrderData {
  _id: string
  orderId: string
  items: OrderItem[]
  customer: Customer
  shipping: Shipping
  payment: Payment
  totals: Totals
  notes?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'N/A'
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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
      const response = await fetch(`/api/orders`)
      const data = await response.json()
      
      if (data.success && data.orders) {
        // Find the order with matching orderId
        const order = data.orders.find((o: OrderData) => o.orderId === orderId)
        if (order) {
          setOrderData(order)
        } else {
          toast({
            title: "Order not found",
            description: "The order details could not be retrieved.",
            variant: "destructive"
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch order details.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch order details.",
        variant: "destructive"
      })
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
        name: "Classic Rider Jacket",
        price: 480,
        quantity: 1,
        image: "/classic-walnut-leather-rider-jacket-studio.jpg"
      },
      {
        name: "Heritage Bomber",
        price: 520,
        quantity: 1,
        image: "/minimal-brown-leather-bomber-jacket-studio.jpg"
      }
    ],
    shipping: {
      name: "John Doe",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States"
    },
    totals: {
      subtotal: 1000,
      tax: 80,
      shipping: 0,
      total: 1080
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
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading order details...</span>
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
                  <span>{orderData ? new Date(orderData.createdAt).toLocaleDateString() : displayData.orderDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span>{displayData.estimatedDelivery}</span>
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
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      {orderData && orderData.items[index] && (
                        <p className="text-xs text-muted-foreground">Product ID: {orderData.items[index].productId}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
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
                  <p className="font-medium">{orderData ? `${orderData.customer.firstName} ${orderData.customer.lastName}` : displayData.shipping.name}</p>
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

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Confirmation Email</h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email with your order details and tracking information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Your order is being prepared and will be shipped within 1-2 business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Tracking Information</h3>
                    <p className="text-sm text-muted-foreground">
                      You'll receive tracking information via email once your order ships.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Total & Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${displayData.totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">${displayData.totals.shipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${displayData.totals.tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${displayData.totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  
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
