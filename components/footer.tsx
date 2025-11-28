"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronDown, ArrowUp, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Footer() {
  const [country, setCountry] = useState("India (INR ₹)")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const whatsappNumber = "+918108101204"

  return (
    <>
      <footer 
        className="mt-16 relative" 
        id="contact" 
        style={{ 
          backgroundColor: '#3E160C',
          backgroundImage: 'none',
          background: '#3E160C',
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          zIndex: 100
        }}
      >
        <div 
          className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16 py-12 relative z-10"
          style={{
            backgroundColor: '#3E160C',
            backgroundImage: 'none',
            background: '#3E160C',
            position: 'relative'
          }}
        >
          {/* Four Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand and Contact */}
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#a4863d' }}>Walnut Leather</h3>
              <div className="flex flex-col gap-2">
                <p className="text-sm" style={{ color: '#a4863d' }}>
                  <span className="font-medium">Email:</span> walnutleather@example.com
                </p>
                <p className="text-sm" style={{ color: '#a4863d' }}>
                  <span className="font-medium">Phone:</span> (+91) 8108101204
                </p>
              </div>
            </div>

            {/* Column 2: GET TO KNOW US */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-base uppercase tracking-wide" style={{ color: '#a4863d' }}>
                GET TO KNOW US
              </h4>
              <Link 
                href="/our-story" 
                className="text-sm transition-colors duration-300 hover:opacity-80" 
                style={{ color: '#a4863d' }}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="text-sm transition-colors duration-300 hover:opacity-80" 
                style={{ color: '#a4863d' }}
              >
                Contact Us
              </Link>
            </div>

            {/* Column 3: CUSTOMER SERVICE */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-base uppercase tracking-wide" style={{ color: '#a4863d' }}>
                CUSTOMER SERVICE
              </h4>
              <Link 
                href="/privacy-policy" 
                className="text-sm transition-colors duration-300 hover:opacity-80" 
                style={{ color: '#a4863d' }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/refund-policy" 
                className="text-sm transition-colors duration-300 hover:opacity-80" 
                style={{ color: '#a4863d' }}
              >
                Refund Policy
              </Link>
              <Link 
                href="/shipping-policy" 
                className="text-sm transition-colors duration-300 hover:opacity-80" 
                style={{ color: '#a4863d' }}
              >
                Shipping Policy
              </Link>
              <Link 
                href="/terms-of-service" 
                className="text-sm transition-colors duration-300 hover:opacity-80" 
                style={{ color: '#a4863d' }}
              >
                Terms of Service
              </Link>
              <Link 
                href="/contact" 
                className="text-sm transition-colors duration-300 hover:opacity-80" 
                style={{ color: '#a4863d' }}
              >
                Contact Information
              </Link>
            </div>

            {/* Column 4: NEWSLETTER */}
            <div>
              <h4 className="font-bold text-base uppercase tracking-wide mb-4" style={{ color: '#a4863d' }}>
                NEWSLETTER
              </h4>
              <div className="mb-4">
                <p className="text-sm mb-2" style={{ color: '#a4863d' }}>
                  <strong>Exclusive Discounts:</strong> Receive special offers and promo codes only available to our subscribers.
                </p>
                <p className="text-sm" style={{ color: '#a4863d' }}>
                  <strong>New Arrivals:</strong> Get early access to new collections and limited-edition pieces.
                </p>
              </div>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  // Handle newsletter subscription
                }}
                aria-label="Newsletter signup form"
              >
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  aria-label="Email address" 
                  className="bg-white/10 border-white/20 placeholder:text-white/60 focus:bg-white/20 text-white"
                  style={{ borderColor: '#a4863d' }}
                />
                <Button 
                  type="submit" 
                  className="w-full hover:opacity-90 transition-opacity duration-300 uppercase font-semibold"
                  style={{ backgroundColor: '#a4863d', color: '#3E160C' }}
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t" style={{ borderColor: '#a4863d' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left Side: Country Selector and Copyright */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center gap-2 text-sm transition-colors duration-300 hover:opacity-80"
                      style={{ color: '#a4863d' }}
                    >
                      <span>🇮🇳</span>
                      <span>{country}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white">
                    <DropdownMenuItem onClick={() => setCountry("India (INR ₹)")}>
                      🇮🇳 India (INR ₹)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCountry("United States (USD $)")}>
                      🇺🇸 United States (USD $)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCountry("United Kingdom (GBP £)")}>
                      🇬🇧 United Kingdom (GBP £)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCountry("Canada (CAD $)")}>
                      🇨🇦 Canada (CAD $)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-sm" style={{ color: '#a4863d' }}>
                  © {new Date().getFullYear()}, WALNUT LEATHER. All rights reserved.
                </p>
              </div>

              {/* Right Side: Payment Icons */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#a4863d' }}>
                  We Accept:
                </span>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700">VISA</div>
                  <div className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700">MC</div>
                  <div className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700">AMEX</div>
                  <div className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700">DISCOVER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: '#25D366' }}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 bg-white hover:bg-gray-100"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6 text-gray-800" />
        </button>
      )}
    </>
  )
}