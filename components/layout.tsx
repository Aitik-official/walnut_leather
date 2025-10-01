"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CartProvider } from "@/components/cart-context"
import { AuthProvider } from "@/components/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "./navbar"
import Footer from "./footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()
  const { toast } = useToast()

  // Check if current page is a dashboard page
  const isDashboardPage = pathname?.startsWith('/dashboard')

  function handleAddToCart(name: string) {
    setCartCount((c) => c + 1)
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    })
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground">
          {!isDashboardPage && <Navbar cartCount={cartCount} />}
          <main>
            {children}
          </main>
          {!isDashboardPage && <Footer />}
        </div>
      </CartProvider>
      <Toaster />
    </AuthProvider>
  )
}
