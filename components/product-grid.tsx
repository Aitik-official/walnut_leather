"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

type Product = {
  id: string
  name: string
  price: string
  image: string
}

const products: Product[] = [
  {
    id: "rider",
    name: "Classic Rider Jacket",
    price: "$480",
    image: "/classic-walnut-leather-rider-jacket-studio.jpg",
  },
  {
    id: "aviator",
    name: "Shearling Aviator",
    price: "$620",
    image: "/walnut-leather-aviator-jacket-shearling-collar.jpg",
  },
  {
    id: "bomber",
    name: "Heritage Bomber",
    price: "$520",
    image: "/minimal-brown-leather-bomber-jacket-studio.jpg",
  },
  {
    id: "moto",
    name: "Minimalist Moto",
    price: "$540",
    image: "/minimalist-walnut-leather-moto-jacket.jpg",
  },
  {
    id: "field",
    name: "Field Jacket",
    price: "$560",
    image: "/heritage-leather-field-jacket-studio.jpg",
  },
  {
    id: "trucker",
    name: "Modern Trucker",
    price: "$500",
    image: "/modern-leather-trucker-jacket.jpg",
  },
  {
    id: "biker",
    name: "City Biker",
    price: "$590",
    image: "/walnut-leather-biker-jacket-studio.jpg",
  },
  {
    id: "blazer",
    name: "Studio Leather Blazer",
    price: "$610",
    image: "/walnut-leather-blazer-studio-shot.jpg",
  },
]

export default function ProductGrid({ onAddToCart }: { onAddToCart: (name: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((p) => (
        <Card key={p.id} className="group border-border/50 hover:border-border hover:shadow-xl hover:bg-stone-50/90 hover:backdrop-blur-md transition-all duration-500 overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-0 relative">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={p.image || "/placeholder.svg?height=600&width=600&query=walnut%20leather%20jacket"}
                alt={`${p.name} in walnut brown leather`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Quick view button */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Button size="sm" variant="secondary" className="bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg">
                  Quick View
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4 group-hover:bg-stone-50/50 transition-colors duration-500">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{p.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Full‑grain leather, hand‑finished with premium hardware.</p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">{p.price}</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-primary rounded-full"></div>
                ))}
                <span className="text-xs text-muted-foreground ml-2">Premium</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-6 pt-0 group-hover:bg-stone-50/30 transition-colors duration-500">
            <Button
              onClick={() => onAddToCart(p.name)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              aria-label={`Add ${p.name} to cart`}
            >
              Add to cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
