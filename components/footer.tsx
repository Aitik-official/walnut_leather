"use client"

import Link from "next/link"
import { ArrowUp, MapPin, Mail, Phone } from "lucide-react"
import { useState, useEffect } from "react"

export default function Footer() {
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

  const whatsappNumber = "+919653418049"

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
            {/* Column 1: Brand & Logo Card */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-2 md:p-2.5 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <img 
                    src="/logo/walnut-leather-logoonly.png" 
                    alt="Walnut Leather Logo" 
                    className="h-8 md:h-9 w-auto object-contain" 
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold tracking-wide" style={{ color: '#a4863d' }}>
                  Walnut Leather
                </h3>
              </div>
              <p className="text-sm leading-relaxed opacity-90" style={{ color: '#a4863d' }}>
                Crafting luxury full-grain leather jackets and goods with timeless design and handcrafted durability.
              </p>
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
                href="/shop" 
                className="text-sm transition-colors duration-300 hover:opacity-80" 
                style={{ color: '#a4863d' }}
              >
                Shop Collection
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
            </div>

            {/* Column 4: CONTACT US (Placed on Right Side) */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-base uppercase tracking-wide" style={{ color: '#a4863d' }}>
                CONTACT US
              </h4>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-3" style={{ color: '#a4863d' }}>
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-[#a4863d]" />
                  <p className="text-sm leading-relaxed">
                    Juhi Niharika Mirage, 9th Floor, office no. 911, Sector -10, Kharghar- 410210.
                  </p>
                </div>
                <div className="flex items-center gap-3" style={{ color: '#a4863d' }}>
                  <Mail className="h-5 w-5 shrink-0 text-[#a4863d]" />
                  <a href="mailto:info@walnutleather.com" className="text-sm hover:underline">
                    info@walnutleather.com
                  </a>
                </div>
                <div className="flex items-center gap-3" style={{ color: '#a4863d' }}>
                  <Phone className="h-5 w-5 shrink-0 text-[#a4863d]" />
                  <div className="text-sm flex flex-wrap items-center gap-1.5">
                    <a href="tel:+919653418049" className="hover:underline">+91 9653418049</a>
                    <span>/</span>
                    <a href="tel:+91913723796" className="hover:underline">+91 913723796</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t" style={{ borderColor: '#a4863d' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm" style={{ color: '#a4863d' }}>
                © {new Date().getFullYear()}, WALNUT LEATHER. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Walnut%20Leather%2C%20I%20have%20an%20inquiry.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group bg-[#25D366] hover:bg-[#20bd5a] text-white border-2 border-white/20"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-current shrink-0"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="text-sm font-semibold tracking-wide hidden sm:inline">
          Chat on WhatsApp
        </span>
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