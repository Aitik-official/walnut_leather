import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Collection | Walnut Leather",
  description: "Curated collections highlighting craftsmanship and style.",
}

const collections = [
  {
    slug: "riders",
    title: "Riders",
    desc: "Iconic silhouettes with modern ergonomics. Built for the road, designed for life.",
    img: "/walnut-leather-rider-jacket-collection.jpg",
    count: "8 Styles",
    featured: true,
  },
  {
    slug: "bombers",
    title: "Bombers",
    desc: "Clean lines, timeless proportions. Military heritage meets contemporary style.",
    img: "/walnut-leather-bomber-jacket-collection.jpg",
    count: "6 Styles",
    featured: false,
  },
  {
    slug: "aviators",
    title: "Aviators",
    desc: "Shearling collars and vintage flight details. Born from aviation, refined for today.",
    img: "/walnut-leather-aviator-jacket-collection.jpg",
    count: "5 Styles",
    featured: true,
  },
  {
    slug: "blazers",
    title: "Blazers",
    desc: "Tailored leather layers for refined looks. Where sophistication meets durability.",
    img: "/walnut-leather-blazer-collection.jpg",
    count: "4 Styles",
    featured: false,
  },
]

export default function CollectionPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 md:px-10 lg:px-16 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <div className="space-y-6">
                                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            <span className="features-gradient">Our Collections</span>
                          </h1>
                          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Explore our curated sets by use and style—each reflects our commitment to materials and craftsmanship. 
                Every collection tells a story of heritage, innovation, and timeless design.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border/50">
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground">23+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide mt-2">Unique Styles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide mt-2">Collections</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide mt-2">Handcrafted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {collections.map((c, index) => (
              <Card key={c.slug} className="group overflow-hidden border-border/50 hover:border-border hover:shadow-xl transition-all duration-700 bg-background/80 backdrop-blur-sm">
                <CardHeader className="p-0 relative">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={c.img || "/placeholder.svg"}
                      alt={`${c.title} collection preview`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Featured badge */}
                    {c.featured && (
                      <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Featured
                      </div>
                    )}
                    
                    {/* Collection count */}
                    <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 text-sm font-semibold text-foreground">
                      {c.count}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <CardTitle className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {c.title}
                    </CardTitle>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {c.desc}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 transition-all duration-300 hover:shadow-lg hover:scale-105">
                      <Link href="/shop" aria-label={`Shop ${c.title} collection`}>
                        Explore Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">Premium</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Ready to Find Your <span className="text-primary">Perfect Jacket</span>?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Browse our complete collection and discover the leather jacket that matches your style and lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/shop" aria-label="Shop all jackets">
                  Shop All Jackets
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-primary/20 text-foreground hover:bg-primary/5 bg-transparent px-8 py-6 text-lg font-semibold transition-all duration-300">
                <Link href="/our-story" aria-label="Learn about our story">
                  Our Story
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
