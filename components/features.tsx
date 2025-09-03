import { ShieldCheck, Leaf, Hammer, Truck, Award, Users, Clock, Heart } from "lucide-react"

const items = [
  {
    icon: ShieldCheck,
    title: "Lifetime Warranty",
    desc: "We stand behind every stitch. Repairs or replacements for manufacturing defects.",
    highlight: "15+ Years",
  },
  {
    icon: Leaf,
    title: "Premium Full‑Grain",
    desc: "Naturally tanned, richly grained leather that develops a unique patina.",
    highlight: "100% Natural",
  },
  {
    icon: Hammer,
    title: "Hand‑Finished",
    desc: "Edges burnished by hand. Solid brass hardware. Built to last decades.",
    highlight: "Artisan Made",
  },
  {
    icon: Truck,
    title: "Fast, Free Shipping",
    desc: "Complimentary 48‑hour shipping and carbon‑offset deliveries.",
    highlight: "48h Delivery",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fashion Designer",
    content: "The quality is exceptional. My Walnut Leather jacket has aged beautifully over the years.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Business Executive",
    content: "Perfect blend of style and durability. Goes from office to weekend seamlessly.",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Photographer",
    content: "The craftsmanship is outstanding. This jacket will last me a lifetime.",
    rating: 5,
  },
]

export default function Features() {
  return (
    <section aria-labelledby="features" className="px-6 md:px-10 lg:px-16 py-20 bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <h2 id="features" className="text-pretty text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="features-gradient">
              Why Choose
            </span>
            <br />
            <span className="features-gradient">Walnut Leather</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-4xl mx-auto leading-relaxed font-medium">
            Every piece is crafted with <span className="text-primary font-semibold">uncompromising attention to detail</span> and built to last a lifetime. 
            Discover what makes our leather jackets the choice of <span className="text-secondary font-semibold">discerning customers worldwide</span>.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {items.map((f, index) => (
            <div key={f.title} className="group relative">
              <div className="rounded-3xl border border-primary/20 p-8 bg-white/90 backdrop-blur-md hover:shadow-xl transition-all duration-500 hover:border-primary/40 hover:-translate-y-3 hover:bg-white/95">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-2xl flex items-center justify-center mb-6 group-hover:from-primary/25 group-hover:to-secondary/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <f.icon className="h-10 w-10 text-primary group-hover:text-primary/90" aria-hidden="true" />
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-primary/15 to-secondary/15 text-primary px-4 py-2 rounded-full text-sm font-bold mb-3 border border-primary/20 group-hover:from-primary/25 group-hover:to-secondary/25 transition-all duration-300">
                      {f.highlight}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 group-hover:drop-shadow-sm">{f.title}</h3>
                  <p className="text-foreground/70 leading-relaxed font-medium group-hover:text-foreground/80 transition-colors duration-300">{f.desc}</p>
                </div>
                
                {/* Enhanced decorative elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="features-gradient">
              What Our Customers Say
            </span>
          </h3>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed font-medium">
            Join thousands of <span className="text-primary font-semibold">satisfied customers</span> who have made Walnut Leather their trusted choice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="group">
              <div className="rounded-3xl border border-primary/20 p-8 bg-white/90 backdrop-blur-md hover:shadow-xl transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:bg-white/95">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full mr-1 shadow-sm"></div>
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 italic font-medium text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full flex items-center justify-center mr-4 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-primary font-bold text-xl">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-lg group-hover:text-primary transition-colors duration-300">{testimonial.name}</div>
                    <div className="text-sm text-foreground/60 font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
