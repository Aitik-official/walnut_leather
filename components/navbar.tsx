"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function Navbar({ cartCount }: { cartCount: number }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md shadow-lg border-b border-primary/20 transition-all duration-500">
      <nav className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Walnut Leather home">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 bg-white/20 backdrop-blur-sm">
            <span className="font-bold text-sm text-white">W</span>
          </div>
          <span className="text-2xl font-bold tracking-tight transition-colors duration-300 text-white group-hover:text-white/80">
            Walnut Leather
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="relative text-sm font-medium transition-colors duration-300 group text-white/80 hover:text-white">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-white/60"></span>
          </Link>
          <Link href="/collection" className="relative text-sm font-medium transition-colors duration-300 group text-white/80 hover:text-white">
            Collection
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-white/60"></span>
          </Link>
          <Link href="/our-story" className="relative text-sm font-medium transition-colors duration-300 group text-white/80 hover:text-white">
            Our Story
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-white/60"></span>
          </Link>
          <Link href="/contact" className="relative text-sm font-medium transition-colors duration-300 group text-white/80 hover:text-white">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-white/60"></span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button asChild className="font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30" aria-label="Shop jackets">
            <Link href="/shop">Shop now</Link>
          </Button>
          <Link
            href="#cart"
            className="relative inline-flex items-center p-3 rounded-xl transition-all duration-300 group hover:bg-white/10"
            aria-label="Cart"
          >
            <ShoppingBag className="h-6 w-6 transition-colors duration-300 text-white group-hover:text-white/80" aria-hidden="true" />
            <span className="sr-only">Items in cart</span>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 h-6 min-w-6 px-1.5 rounded-full text-xs font-bold flex items-center justify-center animate-pulse bg-white/20 backdrop-blur-sm text-white border border-white/30"
                aria-label={`${cartCount} items in cart`}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
