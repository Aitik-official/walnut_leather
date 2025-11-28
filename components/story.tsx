import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Award, Users, Clock, Heart } from "lucide-react"

const achievements = [
  {
    icon: Award,
    number: "15+",
    label: "Years Experience",
    description: "Crafting excellence since 2008",
  },
  {
    icon: Users,
    number: "10K+",
    label: "Happy Customers",
    description: "Trusted worldwide",
  },
  {
    icon: Clock,
    number: "100%",
    label: "Handcrafted",
    description: "No shortcuts taken",
  },
  {
    icon: Heart,
    number: "5★",
    label: "Customer Rating",
    description: "Consistently rated",
  },
]

export default function Story() {
  return (
    <section id="story" aria-labelledby="our-story" className="px-6 md:px-10 lg:px-16 py-20 bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 relative overflow-hidden" style={{ zIndex: 1 }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ zIndex: 0 }}>
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border-2 border-border/20 shadow-2xl">
              <img
                src="/artisan-handcrafting-walnut-brown-leather-jacket-a.jpg"
                alt="Artisan handcrafting a walnut brown leather jacket at a workbench"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Quality badge */}
              <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 shadow-lg">
                <span className="text-sm font-semibold text-foreground">Handcrafted Excellence</span>
              </div>
            </div>
            
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-6">
              <h2
                id="our-story"
                className="text-pretty text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              >
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
                <Link href="/our-story" aria-label="Read our full story">
                  Our Story
                </Link>
              </Button>
            </div>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-border/50">
              {achievements.map((achievement, index) => (
                <div key={achievement.label} className="text-center group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                    <achievement.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{achievement.number}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{achievement.label}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
