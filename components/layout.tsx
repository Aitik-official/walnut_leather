"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "./navbar"
import Footer from "./footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0)
  const { toast } = useToast()

  function handleAddToCart(name: string) {
    setCartCount((c) => c + 1)
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar cartCount={cartCount} />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}
