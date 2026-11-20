"use client"

import { useState, useEffect, useRef } from "react"
import { useCart } from "@/components/cart-context"
import { useCurrency } from "@/components/currency-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Lock, Truck, ShieldCheck, CheckCircle2, Banknote, HelpCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

function PaypalLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 4H4.8C4.3 4 3.9 4.4 3.8 4.9L0.5 25.8C0.4 26.2 0.7 26.6 1.1 26.6H5.2C5.6 26.6 6 26.3 6.1 25.8L7.3 18.2C7.4 17.7 7.8 17.4 8.3 17.4H11.2C16.8 17.4 20.2 14.7 21.1 9.3C21.5 6.9 20.7 5.1 19.3 4.2C17.6 3.1 14.8 4 12.5 4Z" fill="#003087"/>
      <path d="M21.1 9.3C20.2 14.7 16.8 17.4 11.2 17.4H8.3C7.8 17.4 7.4 17.7 7.3 18.2L5.8 27.7C5.7 28.1 6.1 28.5 6.5 28.5H10.1C10.5 28.5 10.9 28.2 11 27.7L12.1 20.8C12.2 20.3 12.6 20 13.1 20H14.7C19.7 20 22.8 17.6 23.6 12.7C23.9 10.6 23.3 9 22.1 8.2C21.8 8.6 21.4 8.9 21.1 9.3Z" fill="#0079C1"/>
      <path d="M19.3 4.2C17.6 3.1 14.8 4 12.5 4H4.8C4.3 4 3.9 4.4 3.8 4.9L0.5 25.8C0.4 26.2 0.7 26.6 1.1 26.6H5.2L7.3 18.2C7.4 17.7 7.8 17.4 8.3 17.4H11.2C16.8 17.4 20.2 14.7 21.1 9.3C21.9 4.3 17.8 4 19.3 4.2Z" fill="#00457C"/>
      <text x="32" y="21" fontFamily="system-ui, sans-serif" fontWeight="bold" fontSize="18" fill="#003087">Pay</text>
      <text x="64" y="21" fontFamily="system-ui, sans-serif" fontWeight="bold" fontSize="18" fill="#0079C1">Pal</text>
    </svg>
  )
}

export default function CheckoutPage() {
  const { items, total, count, clear } = useCart()
  const { formatPrice, currency } = useCurrency()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Available payment methods: 'cod' (Cash/Pay on Delivery), 'card' (Credit/Debit Card), 'paypal' (PayPal)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "paypal">("cod")

  const [taxConfig, setTaxConfig] = useState({
    enabled: true,
    taxName: "GST",
    taxRate: 18,
  })

  useEffect(() => {
    const loadTaxSettings = async () => {
      try {
        const res = await fetch("/api/settings/tax")
        const data = await res.json()
        if (data.success && data.settings) {
          setTaxConfig({
            enabled: data.settings.enabled ?? true,
            taxName: data.settings.taxName || "GST",
            taxRate: Number(data.settings.taxRate) || 18,
          })
        }
      } catch (e) {
        console.error("Failed to load tax settings:", e)
      }
    }
    loadTaxSettings()
  }, [])

  const taxAmount = taxConfig.enabled ? (total * taxConfig.taxRate) / 100 : 0
  const finalTotal = total + taxAmount

  const [formData, setFormData] = useState({
    // Billing Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Shipping Address
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Payment Information (optional / for card)
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    
    // Additional
    notes: ""
  })

  const paypalButtonRef = useRef<HTMLDivElement>(null)
  const [isPaypalSdkLoading, setIsPaypalSdkLoading] = useState(false)
  const [paypalSdkError, setPaypalSdkError] = useState<string | null>(null)

  // Real Live PayPal Buttons rendering via official PayPal JS SDK
  useEffect(() => {
    if (paymentMethod !== "paypal") return
    if (!paypalButtonRef.current) return
    if (items.length === 0 || finalTotal <= 0) return

    let isCancelled = false
    const paypalCurrency = currency === "INR" ? "USD" : currency
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "BAA0HLCnKs3TD4XikY0NX-9U_Er6bx7BelxIxuOHbz-f4KvmjckV2h8l8vPrwbrlQROcboW8Xq6K1Keefc"

    const renderButtons = () => {
      if (!(window as any).paypal || !paypalButtonRef.current || isCancelled) return

      try {
        paypalButtonRef.current.innerHTML = ""

        ;(window as any).paypal.Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 48,
          },
          onClick: (_data: any, actions: any) => {
            if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
              toast({
                title: "Missing Contact Details",
                description: "Please fill in your first name, last name, email, and phone number before paying with PayPal.",
                variant: "destructive",
              })
              return actions.reject()
            }
            if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipCode.trim()) {
              toast({
                title: "Missing Shipping Address",
                description: "Please enter your address, city, state, and zip code before paying with PayPal.",
                variant: "destructive",
              })
              return actions.reject()
            }
            return actions.resolve()
          },
          createOrder: async () => {
            try {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount: finalTotal,
                  currency,
                }),
              })
              const data = await res.json()
              if (!res.ok || !data.orderId) {
                toast({
                  title: "PayPal Error",
                  description: data.error || "Failed to initialize PayPal order",
                  variant: "destructive",
                })
                throw new Error(data.error || "Failed to initialize PayPal order")
              }
              return data.orderId
            } catch (err: any) {
              console.error("createOrder error:", err)
              throw err
            }
          },
          onApprove: async (data: { orderID: string }) => {
            setIsProcessing(true)
            try {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paypalOrderId: data.orderID,
                  orderData: {
                    items: items.map((item) => ({
                      productId: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: item.qty,
                      image: item.image,
                    })),
                    customer: {
                      firstName: formData.firstName.trim(),
                      lastName: formData.lastName.trim(),
                      email: formData.email.trim(),
                      phone: formData.phone.trim(),
                    },
                    shipping: {
                      address: formData.address.trim(),
                      apartment: formData.apartment.trim(),
                      city: formData.city.trim(),
                      state: formData.state.trim(),
                      zipCode: formData.zipCode.trim(),
                      country: formData.country,
                    },
                    totals: {
                      subtotal: total,
                      tax: taxAmount,
                      taxRate: taxConfig.enabled ? taxConfig.taxRate : 0,
                      taxName: taxConfig.taxName,
                      shipping: 0,
                      total: finalTotal,
                      currency,
                    },
                    notes: formData.notes,
                  },
                }),
              })

              const result = await res.json()
              if (!res.ok || !result.success) {
                throw new Error(result.error || "Failed to capture PayPal payment")
              }

              if (typeof window !== "undefined") {
                try {
                  sessionStorage.setItem(
                    "last_placed_order",
                    JSON.stringify({
                      ...result.order,
                      orderId: result.orderId,
                    })
                  )
                } catch (e) {}
              }

              clear()
              toast({
                title: "Payment Received & Order Confirmed!",
                description: `Your order #${result.orderId} has been successfully paid via PayPal.`,
              })
              router.push(`/order-confirmation?orderId=${result.orderId}`)
            } catch (err: any) {
              console.error("PayPal capture error:", err)
              toast({
                title: "Payment Error",
                description: err.message || "Failed to finalize PayPal payment. Please contact support.",
                variant: "destructive",
              })
            } finally {
              setIsProcessing(false)
            }
          },
          onError: (err: any) => {
            console.error("PayPal Buttons error:", err)
            toast({
              title: "PayPal Cancelled",
              description: "The payment was not completed or was cancelled. Please try again.",
              variant: "destructive",
            })
          },
        }).render(paypalButtonRef.current)
        setIsPaypalSdkLoading(false)
      } catch (err: any) {
        console.error("Failed to render PayPal buttons:", err)
        setPaypalSdkError(err.message || "Failed to render PayPal buttons")
        setIsPaypalSdkLoading(false)
      }
    }

    const existingScript = document.getElementById("paypal-sdk-script") as HTMLScriptElement | null
    if (existingScript && (window as any).paypal) {
      renderButtons()
      return () => {
        isCancelled = true
        if (paypalButtonRef.current) paypalButtonRef.current.innerHTML = ""
      }
    }

    if (existingScript) {
      existingScript.remove()
    }

    setIsPaypalSdkLoading(true)
    setPaypalSdkError(null)

    const script = document.createElement("script")
    script.id = "paypal-sdk-script"
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(paypalCurrency)}&intent=capture`
    script.async = true
    script.onload = () => {
      renderButtons()
    }
    script.onerror = () => {
      setIsPaypalSdkLoading(false)
      setPaypalSdkError("Unable to load PayPal checkout. Please check your connection.")
    }
    document.body.appendChild(script)

    return () => {
      isCancelled = true
      if (paypalButtonRef.current) paypalButtonRef.current.innerHTML = ""
    }
  }, [paymentMethod, finalTotal, currency, items.length])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Unified order submission that reliably works with or without advance payment
  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // 1. Validate Customer Billing Info
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast({
        title: "Missing Contact Details",
        description: "Please enter your first name, last name, email, and phone number.",
        variant: "destructive",
      })
      return
    }

    // 2. Validate Shipping Address
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipCode.trim()) {
      toast({
        title: "Missing Shipping Address",
        description: "Please fill in your address, city, state, and zip code.",
        variant: "destructive",
      })
      return
    }

    // 3. Validate Card if Card is explicitly selected
    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        toast({
          title: "Incomplete Card Info",
          description: "Please enter your card number, expiry date, and CVV.",
          variant: "destructive",
        })
        return
      }
    }

    setIsProcessing(true)

    try {
      // Determine payment metadata based on selected option
      let paymentInfo: { method: string; last4?: string; transactionId?: string; payerEmail?: string }
      if (paymentMethod === "card") {
        paymentInfo = {
          method: "card",
          last4: formData.cardNumber.replace(/\s/g, "").slice(-4) || "4242",
        }
      } else if (paymentMethod === "paypal") {
        paymentInfo = {
          method: "paypal",
          transactionId: `PAYPAL_${Date.now()}`,
          payerEmail: formData.email,
          last4: "PayPal",
        }
      } else {
        // Direct / Pay on Delivery
        paymentInfo = {
          method: "cash_on_delivery",
          last4: "Pay on Delivery",
          transactionId: `COD_${Date.now()}`,
        }
      }

      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image,
        })),
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        shipping: {
          address: formData.address.trim(),
          apartment: formData.apartment.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          country: formData.country,
        },
        payment: paymentInfo,
        totals: {
          subtotal: total,
          tax: taxAmount,
          taxRate: taxConfig.enabled ? taxConfig.taxRate : 0,
          taxName: taxConfig.taxName,
          shipping: 0,
          total: finalTotal,
          currency: currency,
        },
        notes: formData.notes,
        status: "confirmed",
      }

      // Submit to MongoDB Orders API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to save order to database")
      }

      const createdOrderId = result.orderId || `WL${Date.now()}`

      // Cache placed order in sessionStorage so confirmation page always displays instantly
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            "last_placed_order",
            JSON.stringify({
              ...orderData,
              orderId: createdOrderId,
              createdAt: new Date().toISOString(),
            })
          )
        } catch (e) {}
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${createdOrderId} has been confirmed.`,
      })

      // Clear session cart
      clear()

      // Redirect directly to confirmation
      router.push(`/order-confirmation?orderId=${createdOrderId}`)
    } catch (error: any) {
      console.error("Order submission error:", error)
      toast({
        title: "Order Error",
        description: error.message || "Failed to process your order. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              <span className="features-gradient">Checkout</span>
            </h1>
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="features-gradient">Checkout</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Direct Guest Checkout — No account or login required.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>SSL 256-Bit Encrypted Order</span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form Left Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Customer Information */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3 border-b bg-stone-50/40">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  1. Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="e.g. John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="e.g. Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Shipping Address */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3 border-b bg-stone-50/40">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  2. Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="apartment" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Apartment, Suite, Unit (optional)
                  </Label>
                  <Input
                    id="apartment"
                    placeholder="Apt 4B"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange("apartment", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      City *
                    </Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      State / Region *
                    </Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="zipCode" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      ZIP / Postal Code *
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Country *
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 3. Payment Method Options */}
            <Card className="border-2 border-primary/20 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50/50 pb-3 border-b">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    3. Payment Information
                  </span>
                  <Badge variant="outline" className="bg-white text-xs font-normal">
                    Instant Confirmation
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                <div>
                  <Label className="text-sm font-semibold mb-3 block">
                    Choose how you want to complete your order:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Method 1: Direct Order / Pay on Delivery */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex flex-col justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "cod" ? "border-primary" : "border-gray-300"
                        }`}>
                          {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <Banknote className="h-5 w-5 text-amber-800" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Direct Order</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Pay upon delivery / No card needed</p>
                      </div>
                    </button>

                    {/* Method 2: Credit / Debit Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-col justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "card" ? "border-primary" : "border-gray-300"
                        }`}>
                          {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <CreditCard className="h-5 w-5 text-blue-800" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Credit / Debit Card</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Visa, Mastercard, Amex</p>
                      </div>
                    </button>

                    {/* Method 3: PayPal */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex flex-col justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === "paypal"
                          ? "border-[#0070BA] bg-[#0070BA]/5 shadow-xs"
                          : "border-border hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "paypal" ? "border-[#0070BA]" : "border-gray-300"
                        }`}>
                          {paymentMethod === "paypal" && <div className="w-2 h-2 rounded-full bg-[#0070BA]" />}
                        </div>
                        <PaypalLogo className="h-5 w-auto" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#003087]">PayPal</p>
                        <p className="text-xs text-muted-foreground mt-0.5">PayPal balance & cards</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Direct Order Details */}
                {paymentMethod === "cod" && (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                      <CheckCircle2 className="h-4 w-4 text-green-700" />
                      Simple Direct Order (Zero Card Required)
                    </div>
                    <p className="text-xs text-amber-800/90 leading-relaxed">
                      Your order will be confirmed immediately. Our representative will prepare your handcrafted leather shipment and confirm delivery details with you.
                    </p>
                  </div>
                )}

                {/* Credit Card Inputs */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-3 border-t">
                    <div className="space-y-1.5">
                      <Label htmlFor="cardNumber" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Card Number *
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 "))}
                        maxLength={19}
                        required={paymentMethod === "card"}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="expiryDate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Expiry Date *
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1/"))}
                          maxLength={5}
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cvv" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          CVV *
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                          maxLength={4}
                          required={paymentMethod === "card"}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="cardName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Name on Card
                      </Label>
                      <Input
                        id="cardName"
                        placeholder="e.g. John Doe"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange("cardName", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Details */}
                {paymentMethod === "paypal" && (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <PaypalLogo className="h-5 w-auto" />
                      <span className="text-xs font-semibold text-blue-900">Official PayPal Live Checkout</span>
                    </div>
                    <p className="text-xs text-blue-800/90 leading-relaxed">
                      Click the official PayPal button on the right to log in to your PayPal account and pay securely.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 4. Order Notes */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Special Delivery Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any custom instructions, gate codes, or delivery requests?"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={2}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-md border-primary/20">
              <CardHeader className="border-b bg-stone-50/50 pb-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Order Items Preview */}
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0 bg-stone-100 rounded overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                      <p className="font-semibold text-xs">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Cost Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium text-foreground">{formatPrice(total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <span>{taxConfig.enabled ? `${taxConfig.taxName} (${taxConfig.taxRate}%)` : "Tax"}</span>
                    <span className="font-medium text-foreground">{formatPrice(taxAmount)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold pt-1">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Primary Action Button or Real PayPal Button */}
                {paymentMethod === "paypal" ? (
                  <div className="space-y-3 pt-2">
                    {isPaypalSdkLoading && (
                      <div className="flex items-center justify-center p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs text-amber-900 gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                        <span>Loading official PayPal portal...</span>
                      </div>
                    )}
                    {paypalSdkError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                        {paypalSdkError}
                      </div>
                    )}
                    <div
                      id="paypal-button-container"
                      ref={paypalButtonRef}
                      className="min-h-[50px] relative z-10"
                    />
                    <p className="text-[11px] text-center text-muted-foreground">
                      {currency === "INR"
                        ? `PayPal processes live in USD equivalent (~$${(finalTotal / 83.5).toFixed(2)} USD)`
                        : "Processed live & securely by PayPal"}
                    </p>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full text-base font-bold py-6 shadow-md transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isProcessing ? (
                      "Processing Order..."
                    ) : paymentMethod === "cod" ? (
                      `Place Direct Order — ${formatPrice(finalTotal)}`
                    ) : (
                      `Place Order — ${formatPrice(finalTotal)}`
                    )}
                  </Button>
                )}

                <div className="text-center pt-1">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span>Instant order confirmation & tracking</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </main>
  )
}
