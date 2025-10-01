"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Hero from "./hero"
import DynamicProductGrid from "./dynamic-product-grid"
import Features from "./features"
import Story from "./story"
import Link from "next/link"

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
          
          <DynamicProductGrid onAddToCart={handleAddToCart} limit={4} />
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Explore More Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Features />
      <Story />
    </>
  )
}
