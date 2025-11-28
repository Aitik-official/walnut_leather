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
    <section aria-labelledby="features" className="px-6 md:px-10 lg:px-16 py-20 relative overflow-hidden" style={{ backgroundColor: '#F3F3F3', zIndex: 1 }}>
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
              <div 
                className="rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 border feature-card-hover" 
                style={{ 
                  backgroundColor: '#3E160C',
                  borderColor: 'rgba(164, 134, 61, 0.3)',
                  borderWidth: '1px'
                }}
              >
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 mx-auto">
                    <f.icon className="h-10 w-10 transition-colors duration-300" style={{ color: '#a4863d' }} aria-hidden="true" />
                  </div>
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-3 border transition-all duration-300" style={{ color: '#a4863d', borderColor: '#a4863d' }}>
                      {f.highlight}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300" style={{ color: '#a4863d' }}>{f.title}</h3>
                  <p className="leading-relaxed font-medium transition-colors duration-300" style={{ color: '#a4863d' }}>{f.desc}</p>
                </div>
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
              <div className="rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2" style={{ backgroundColor: '#050A30' }}>
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full mr-1 shadow-sm" style={{ backgroundColor: '#d4af37' }}></div>
                  ))}
                </div>
                <p className="leading-relaxed mb-6 italic font-medium text-lg" style={{ color: '#d4af37' }}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mr-4 border group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#d4af37', borderColor: '#d4af37' }}>
                    <span className="font-bold text-xl text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-lg transition-colors duration-300" style={{ color: '#d4af37' }}>{testimonial.name}</div>
                    <div className="text-sm font-medium" style={{ color: '#d4af37', opacity: 0.9 }}>{testimonial.role}</div>
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
