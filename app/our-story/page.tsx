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
      {/* Main Story Section - Now with Our Story as Main Heading */}
      <section className="px-6 md:px-10 lg:px-16 pt-12 pb-20 md:pt-16 md:pb-32 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ zIndex: 0 }}>
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                    <span className="features-gradient">Our Story</span>
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground tracking-wide">
                    Timeless Craft. Modern Utility.
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    At Walnut Leather, we source full‑grain hides and finish each piece by hand so your jacket ages with
                    character. Our designs balance clean, modern lines with the durability of traditional craftsmanship.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    From boardroom to boarding gate, our pieces are built to go everywhere—and last for years.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Built on a belief that what you wear should last—crafted with premium hides, thoughtful details, and
                    time-honored techniques that stand the test of time.
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

      {/* Process Section */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ zIndex: 0 }}>
          <div className="absolute top-20 right-20 w-32 h-32 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="features-gradient">The Art of Creation</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every jacket goes through a meticulous journey from hide to masterpiece.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#3E160C' }}
              >
                <span className="text-3xl font-bold" style={{ color: '#a4863d' }}>1</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Selection</h3>
              <p className="text-muted-foreground leading-relaxed">
                We carefully select premium full-grain hides from trusted tanneries, ensuring the highest quality and consistency.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#3E160C' }}
              >
                <span className="text-3xl font-bold" style={{ color: '#a4863d' }}>2</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Crafting</h3>
              <p className="text-muted-foreground leading-relaxed">
                Expert artisans hand-cut, stitch, and finish each piece using time-honored techniques passed down through generations.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#3E160C' }}
              >
                <span className="text-3xl font-bold" style={{ color: '#a4863d' }}>3</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Perfection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every detail is inspected, every edge burnished, and every stitch perfected before it reaches your hands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Journey Section */}
      <section className="px-6 md:px-10 lg:px-16 py-12 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ zIndex: 0 }}>
          <div className="absolute top-20 right-20 w-32 h-32 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border-2 border-border/20 shadow-lg">
                <img
                  src="/walnut-brown-leather-jacket-on-stone-backdrop.jpg"
                  alt="Premium leather jacket showcasing quality craftsmanship"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105 max-h-[400px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              </div>
            </div>
            
            <div className="space-y-4 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                <span className="features-gradient">A Legacy of Excellence</span>
              </h2>
              <div className="space-y-3">
                <p className="text-base text-muted-foreground leading-relaxed">
                  For over 15 years, Walnut Leather has been synonymous with uncompromising quality. Every jacket that leaves our workshop represents hundreds of hours of meticulous attention to detail.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We partner with the world's finest tanneries, selecting only the most premium full-grain leathers that develop a rich patina over time. Our artisans combine traditional techniques with contemporary design, ensuring each piece is both timeless and relevant.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  The result? Leather jackets that don't just withstand the test of time—they become more beautiful with age, telling your story through every crease and mark.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Enhanced Design */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ zIndex: 0 }}>
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="features-gradient">Our Commitment</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Four pillars that define our craftsmanship and guide everything we create.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((f, index) => (
              <div key={f.title} className="group text-center">
                <div className="w-20 h-20 bg-primary/5 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-all duration-300 group-hover:scale-110 shadow-md border border-border/20">
                  <f.icon className="h-10 w-10 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ zIndex: 0 }}>
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="features-gradient">Ready to Be Part of Our Story?</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Discover the craftsmanship that has made Walnut Leather a trusted name for over 15 years. 
                Join thousands of satisfied customers who have chosen quality, durability, and timeless style.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link href="/shop" aria-label="Shop our collection">
                  Shop Our Collection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-primary/20 text-foreground hover:bg-primary/5 bg-transparent px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105">
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
