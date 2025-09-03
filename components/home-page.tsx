"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Hero from "./hero"
import ProductGrid from "./product-grid"
import Features from "./features"
import Story from "./story"

export default function HomePage() {
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
    <>
      <Hero />
      
      <section aria-labelledby="products" className="px-6 md:px-10 lg:px-16 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2
              id="products"
              className="text-pretty text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              <span className="features-gradient">Featured Jackets</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Full‑grain leather jackets crafted to age beautifully. Built to last, designed to impress.
              Each piece tells a story of craftsmanship and timeless style.
            </p>
          </div>
          <ProductGrid onAddToCart={handleAddToCart} />
        </div>
      </section>
      
      <Features />
      <Story />
    </>
  )
}
