"use client"

import { useCart } from "@/components/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthModal from "@/components/auth-modal"
import { useAuth } from "@/components/auth-context"

export default function CartPage() {
  const { items, increment, decrement, remove, clear, total, count } = useCart()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      remove(id)
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } else {
      // Find current quantity and adjust
      const currentItem = items.find(item => item.id === id)
      if (currentItem) {
        const difference = newQuantity - currentItem.qty
        if (difference > 0) {
          for (let i = 0; i < difference; i++) {
            increment(id)
          }
        } else if (difference < 0) {
          for (let i = 0; i < Math.abs(difference); i++) {
            decrement(id)
          }
        }
      }
    }
  }

  const handleClearCart = () => {
    clear()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    } else {
      router.push('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-bold mb-2">
              <span className="features-gradient">Shopping Cart</span>
            </h1>
          </div>

          {/* Empty Cart */}
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            <span className="features-gradient">Shopping Cart</span>
          </h1>
          <p className="text-muted-foreground">
            {count} {count === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                      <p className="text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => decrement(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-center"
                        min="0"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => increment(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-lg">${(item.price * item.qty).toFixed(2)}</p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(item.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({count} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(total * 1.08).toFixed(2)}</span>
                </div>

                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                >
                  Proceed to Checkout
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => router.push('/checkout')}
      />
    </main>
  )
}
