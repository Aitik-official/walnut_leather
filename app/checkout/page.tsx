"use client"

import { useState, useEffect, useRef } from "react"
import { useCart } from "@/components/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Lock, Truck, ShieldCheck, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    paypal?: any
  }
}

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
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")
  const [isPaypalSdkLoaded, setIsPaypalSdkLoaded] = useState(false)
  const paypalButtonContainerRef = useRef<HTMLDivElement>(null)

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
    
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    
    // Additional
    notes: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Load PayPal SDK when PayPal payment is selected
  useEffect(() => {
    if (paymentMethod !== "paypal") return

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test"
    const scriptId = "paypal-sdk-script"

    const renderButtons = () => {
      if (window.paypal && paypalButtonContainerRef.current) {
        paypalButtonContainerRef.current.innerHTML = ""
        try {
          window.paypal
            .Buttons({
              style: {
                layout: "vertical",
                color: "gold",
                shape: "rect",
                label: "paypal",
                height: 48,
              },
              createOrder: (data: any, actions: any) => {
                // Validate customer details before creating PayPal order
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                  toast({
                    title: "Missing Details",
                    description: "Please fill in your name, email, and phone number first.",
                    variant: "destructive",
                  })
                  throw new Error("Missing billing details")
                }
                if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
                  toast({
                    title: "Missing Address",
                    description: "Please fill in your shipping address first.",
                    variant: "destructive",
                  })
                  throw new Error("Missing shipping address")
                }

                return actions.order.create({
                  purchase_units: [
                    {
                      description: "Walnut Leather Order",
                      amount: {
                        currency_code: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "USD",
                        value: finalTotal.toFixed(2),
                      },
                    },
                  ],
                })
              },
              onApprove: async (data: any, actions: any) => {
                setIsProcessing(true)
                try {
                  const details = await actions.order.capture()
                  await submitOrderDirectly({
                    method: "paypal",
                    transactionId: details.id || data.orderID,
                    payerEmail: details.payer?.email_address || formData.email,
                    last4: "PayPal",
                  })
                } catch (err: any) {
                  toast({
                    title: "PayPal Capture Failed",
                    description: err.message || "Failed to finalize PayPal payment.",
                    variant: "destructive",
                  })
                  setIsProcessing(false)
                }
              },
              onError: (err: any) => {
                console.error("PayPal SDK error:", err)
              },
            })
            .render(paypalButtonContainerRef.current)
          setIsPaypalSdkLoaded(true)
        } catch (e) {
          console.error("Failed to render PayPal Buttons:", e)
        }
      }
    }

    if (window.paypal) {
      renderButtons()
      return
    }

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!existingScript) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "USD"}&components=buttons`
      script.async = true
      script.onload = () => {
        setIsPaypalSdkLoaded(true)
        renderButtons()
      }
      script.onerror = () => {
        console.warn("Could not load PayPal SDK (using fallback PayPal flow)")
      }
      document.body.appendChild(script)
    } else {
      existingScript.addEventListener("load", renderButtons)
    }
  }, [paymentMethod, finalTotal, formData])

  // Shared order placement function
  const submitOrderDirectly = async (paymentDetails: {
    method: string
    last4?: string
    transactionId?: string
    payerEmail?: string
  }) => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Incomplete Billing Info",
        description: "Please fill in your name, email, and phone number.",
        variant: "destructive",
      })
      return false
    }

    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        title: "Incomplete Shipping Address",
        description: "Please fill in all required shipping address fields.",
        variant: "destructive",
      })
      return false
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image,
        })),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        payment: paymentDetails,
        totals: {
          subtotal: total,
          tax: taxAmount,
          taxRate: taxConfig.enabled ? taxConfig.taxRate : 0,
          taxName: taxConfig.taxName,
          shipping: 0,
          total: finalTotal,
        },
        notes: formData.notes,
        status: "confirmed",
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to place order")
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${result.orderId} has been confirmed.`,
      })

      clear()
      router.push(`/order-confirmation?orderId=${result.orderId}`)
      return true
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "There was an error completing your order. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "paypal") {
      // Direct PayPal flow
      await submitOrderDirectly({
        method: "paypal",
        transactionId: `PAYPAL_${Date.now()}`,
        payerEmail: formData.email,
        last4: "PayPal",
      })
      return
    }

    // Card flow
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
      toast({
        title: "Card Information Missing",
        description: "Please enter your card number, expiration, CVV, and name.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    await submitOrderDirectly({
      method: "card",
      last4: formData.cardNumber.replace(/\s/g, "").slice(-4) || "4242",
    })
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
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            <span className="features-gradient">Checkout</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Direct Guest Checkout — Enter your shipping & payment details below. No account or login required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input
                    id="apartment"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange("apartment", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
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

            {/* Payment Information */}
            <Card className="border-2 border-primary/20 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50/50 pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Payment Information
                  </span>
                  <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    256-bit Encrypted
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Payment Method Selector Tabs */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Select Payment Method</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Card Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "card" ? "border-primary" : "border-gray-400"
                        }`}>
                          {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Credit / Debit Card</p>
                          <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </button>

                    {/* PayPal Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === "paypal"
                          ? "border-[#0070BA] bg-[#0070BA]/5 shadow-sm"
                          : "border-border hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "paypal" ? "border-[#0070BA]" : "border-gray-400"
                        }`}>
                          {paymentMethod === "paypal" && <div className="w-2.5 h-2.5 rounded-full bg-[#0070BA]" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#003087]">PayPal</p>
                          <p className="text-xs text-muted-foreground">PayPal balance & cards</p>
                        </div>
                      </div>
                      <PaypalLogo className="h-6 w-auto" />
                    </button>
                  </div>
                </div>

                {/* Credit Card Fields */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-2 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 "))}
                        maxLength={19}
                        required={paymentMethod === "card"}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1/"))}
                          maxLength={5}
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card *</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange("cardName", e.target.value)}
                        required={paymentMethod === "card"}
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Direct Section */}
                {paymentMethod === "paypal" && (
                  <div className="space-y-4 pt-2 border-t">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-100 flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-xs flex-shrink-0">
                        <PaypalLogo className="h-5 w-auto" />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-foreground">Safe & Instant PayPal Checkout</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          Pay directly with your PayPal balance, linked bank account, or debit/credit card. Protected by PayPal Buyer Protection.
                        </p>
                      </div>
                    </div>

                    {/* PayPal Smart Buttons Container (Loads when SDK script is available) */}
                    <div ref={paypalButtonContainerRef} id="paypal-button-container" className="w-full min-h-[50px] relative z-10" />

                    {/* Instant Direct PayPal Button (Fallback & Instant click) */}
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="w-full bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-bold text-base py-6 shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 border border-amber-300"
                    >
                      <span>Pay with</span>
                      <PaypalLogo className="h-6 w-auto inline-block" />
                      <span>(${finalTotal.toFixed(2)})</span>
                    </Button>

                    <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      No PayPal account required for guest credit card payments through PayPal
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions for your order?"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                      <p className="font-medium text-sm">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{taxConfig.enabled ? `${taxConfig.taxName} (${taxConfig.taxRate}%)` : "Tax"}</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {paymentMethod === "card" ? (
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Place Order - $${finalTotal.toFixed(2)}`}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-bold text-lg py-6 shadow-md"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Checkout with PayPal - $${finalTotal.toFixed(2)}`}
                  </Button>
                )}

                <div className="text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secure checkout with SSL encryption
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
