import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Leaf, Hammer, Truck, Award, Users, Clock, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Story | Walnut Leather",
  description: "The craft, materials, and philosophy behind Walnut Leather.",
}

const values = [
  {
    icon: ShieldCheck,
    title: "Lifetime Warranty",
    desc: "We stand behind every stitch. Repairs or replacements for manufacturing defects.",
  },
  {
    icon: Leaf,
    title: "Premium Full‑Grain",
    desc: "Naturally tanned, richly grained leather that develops a unique patina.",
  },
  {
    icon: Hammer,
    title: "Hand‑Finished",
    desc: "Edges burnished by hand. Solid brass hardware. Built to last decades.",
  },
  {
    icon: Truck,
    title: "Fast, Free Shipping",
    desc: "Complimentary 48‑hour shipping and carbon‑offset deliveries.",
  },
]



export default function OurStoryPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 md:px-10 lg:px-16 py-20 md:py-32 bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="features-gradient">Our Story</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Built on a belief that what you carry should last—crafted with premium hides, thoughtful details, and
                time-honored techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Story Section - Content Left, Image Right */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-pretty text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  <span className="features-gradient">Timeless Craft. Modern Utility.</span>
                </h2>
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    At Walnut Leather, we source full‑grain hides and finish each piece by hand so your jacket ages with
                    character. Our designs balance clean, modern lines with the durability of traditional craftsmanship.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    From boardroom to boarding gate, our pieces are built to go everywhere—and last for years.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/collection" aria-label="Explore the collection">
                    Explore the Collection
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-primary/20 text-foreground hover:bg-primary/5 bg-transparent px-8 py-6 text-lg font-semibold transition-all duration-300">
                  <Link href="/contact" aria-label="Get in touch">
                    Get in Touch
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-border/20 shadow-2xl">
                <img
                  src="/artisan-handcrafting-walnut-brown-leather-jacket-a.jpg"
                  alt="Artisan handcrafting a walnut brown leather jacket at a workbench"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Concise & Elegant */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              <span className="features-gradient">Our Commitment</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four pillars that define our craftsmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((f, index) => (
              <div key={f.title} className="group text-center">
                <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/90 transition-colors duration-300 group-hover:scale-110 shadow-lg">
                  <f.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Call to Action - Concise & Elegant */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-3xl text-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="features-gradient">Ready to Be Part of Our Story?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Discover the craftsmanship that has made Walnut Leather a trusted name for over 15 years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/shop" aria-label="Shop our collection">
                  Shop Our Collection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-primary/20 text-foreground hover:bg-primary/5 bg-transparent px-8 py-6 text-lg font-semibold transition-all duration-300">
                <Link href="/contact" aria-label="Contact us">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
