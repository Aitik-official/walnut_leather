import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/walnut-brown-leather-jacket-on-stone-backdrop.jpg"
          alt="Walnut brown leather jacket on a minimalist stone backdrop"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-balance text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-tight">
                  Crafted to <span className="silver-gradient">Endure</span>. Designed to <span className="silver-gradient">Impress</span>.
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl">
                  Premium full‑grain leather jackets, hand‑finished for character and built to age beautifully. Walnut
                  Leather blends timeless silhouettes with modern function.
                </p>
              </div>
              
              <dl className="grid grid-cols-3 gap-8 pt-12 border-t border-white/20">
                <div className="text-left">
                  <dt className="text-sm font-medium text-white/70 uppercase tracking-wide">Warranty</dt>
                  <dd className="mt-2 text-3xl font-bold text-white">Lifetime</dd>
                </div>
                <div className="text-left">
                  <dt className="text-sm font-medium text-white/70 uppercase tracking-wide">Material</dt>
                  <dd className="mt-2 text-3xl font-bold text-white">Full‑grain</dd>
                </div>
                <div className="text-left">
                  <dt className="text-sm font-medium text-white/70 uppercase tracking-wide">Shipping</dt>
                  <dd className="mt-2 text-3xl font-bold text-white">Free 48h</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating accent elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl z-5"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary/20 rounded-full blur-2xl z-5"></div>
      
      {/* Quality badge */}
      <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 shadow-lg z-10">
        <span className="text-sm font-semibold text-foreground">Handcrafted Excellence</span>
      </div>
    </section>
  )
}
