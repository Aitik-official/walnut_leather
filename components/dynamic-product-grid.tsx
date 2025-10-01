"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-context"

type StaticProduct = {
  id: string
  name: string
  price: string
  image: string
}

type DatabaseProduct = {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  availableSizes?: string[]
  color?: string
  material?: string
  stock: number
  featured: boolean
  exclusive: boolean
  limitedTimeDeal: boolean
  description: string
}

type CombinedProduct = {
  id: string
  name: string
  price: string
  image: string
  source: 'static' | 'database'
  category?: string
  availableSizes?: string[]
  color?: string
  material?: string
  stock?: number
  featured?: boolean
  exclusive?: boolean
  limitedTimeDeal?: boolean
  description?: string
}

const staticProducts: StaticProduct[] = [
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

interface FilterOptions {
  category: string
  size: string
  color: string
  material: string
  priceRange: number[]
  searchTerm: string
  sortBy: string
  showInStock: boolean
}

export default function DynamicProductGrid({ 
  onAddToCart, 
  limit, 
  filters 
}: { 
  onAddToCart: (name: string) => void, 
  limit?: number,
  filters?: FilterOptions
}) {
  const { add } = useCart()
  const [databaseProducts, setDatabaseProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDatabaseProducts()
  }, [])

  const fetchDatabaseProducts = async () => {
    try {
      const response = await fetch('/api/products/upload')
      const data = await response.json()
      
      if (data.success) {
        setDatabaseProducts(data.products || [])
      } else {
        setError('Failed to load products from database')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products from database')
    } finally {
      setLoading(false)
    }
  }

  // Combine database products first (newly added), then static products
  const allProducts: CombinedProduct[] = [
    // Add database products first (newly added products get priority)
      ...databaseProducts.map(product => ({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        image: product.images[0] || "/placeholder.svg?height=600&width=600&query=walnut%20leather%20jacket",
        source: 'database' as const,
        category: product.category,
        availableSizes: product.availableSizes,
        color: product.color,
        material: product.material,
        stock: product.stock,
        featured: product.featured,
        exclusive: product.exclusive,
        limitedTimeDeal: product.limitedTimeDeal,
        description: product.description
      })),
    // Add static products after database products
    ...staticProducts.map(product => ({
      ...product,
      source: 'static' as const
    }))
  ]

  // Filter products based on filters
  const filteredProducts = allProducts.filter(product => {
    if (!filters) return true

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      if (!product.name.toLowerCase().includes(searchLower) && 
          !product.description?.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Category filter
    if (filters.category !== "all" && product.category !== filters.category) {
      return false
    }

    // Size filter
    if (filters.size !== "all") {
      if (filters.size === "custom") {
        // For custom sizes, check if product has available sizes that are not in standard sizes
        const standardSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
        if (!product.availableSizes || !product.availableSizes.some(size => !standardSizes.includes(size))) {
          return false
        }
      } else if (!product.availableSizes || !product.availableSizes.includes(filters.size)) {
        return false
      }
    }

    // Color filter
    if (filters.color && (!product.color || !product.color.toLowerCase().includes(filters.color.toLowerCase()))) {
      return false
    }

    // Material filter
    if (filters.material && (!product.material || !product.material.toLowerCase().includes(filters.material.toLowerCase()))) {
      return false
    }

    // Price range filter
    const productPrice = parseFloat(product.price.replace('$', ''))
    if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
      return false
    }

    // Stock filter
    if (filters.showInStock && product.source === 'database' && product.stock === 0) {
      return false
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!filters) return 0

    switch (filters.sortBy) {
      case 'price-low':
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
      case 'price-high':
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
      case 'name-a-z':
        return a.name.localeCompare(b.name)
      case 'name-z-a':
        return b.name.localeCompare(a.name)
      case 'newest':
        return b.source === 'database' ? -1 : 1
      case 'featured':
      default:
        // Featured products first (database products with featured flag, then static products)
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        if (a.source === 'database' && b.source === 'static') return -1
        if (a.source === 'static' && b.source === 'database') return 1
        return 0
    }
  })

  // Apply limit if provided
  const combinedProducts = limit ? sortedProducts.slice(0, limit) : sortedProducts

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {[...Array(limit || 8)].map((_, i) => (
          <Card key={i} className="animate-pulse p-0">
            <div className="aspect-[4/5] w-full bg-gray-200"></div>
            <CardContent className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}
      
      {combinedProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {combinedProducts.map((p) => (
          <Card key={p.id} className="group border-border/50 hover:border-border hover:shadow-xl hover:bg-stone-50/90 hover:backdrop-blur-md transition-all duration-500 overflow-hidden bg-card/50 backdrop-blur-sm p-0">
            <Link href={`/products/${p.id}`} className="block">
              <div className="aspect-[4/5] w-full overflow-hidden cursor-pointer relative">
                <img
                  src={p.image || "/placeholder.svg?height=600&width=600&query=walnut%20leather%20jacket"}
                  alt={`${p.name} in walnut brown leather`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Product Tags - Priority order: Limited Deal > Exclusive > Featured > New */}
                {p.limitedTimeDeal && (
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className="text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg backdrop-blur-sm"
                    >
                      Limited Deal
                    </Badge>
                  </div>
                )}

                {!p.limitedTimeDeal && p.exclusive && (
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className="text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg backdrop-blur-sm"
                    >
                      Exclusive
                    </Badge>
                  </div>
                )}

                {!p.limitedTimeDeal && !p.exclusive && p.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className="text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm"
                    >
                      Featured
                    </Badge>
                  </div>
                )}

                {/* New Badge - Only for database products that have no other tags */}
                {p.source === 'database' && !p.featured && !p.exclusive && !p.limitedTimeDeal && (
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className="text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg backdrop-blur-sm"
                    >
                      ✨ New
                    </Badge>
                  </div>
                )}
              </div>
            </Link>
            
            <CardContent className="p-6 space-y-4 group-hover:bg-stone-50/50 transition-colors duration-500">
              <div className="space-y-2">
                <Link href={`/products/${p.id}`}>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 cursor-pointer hover:underline">{p.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.source === 'database' && p.description 
                    ? p.description.substring(0, 80) + (p.description.length > 80 ? '...' : '')
                    : "Full‑grain leather, hand‑finished with premium hardware."
                  }
                </p>
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
                onClick={() => {
                  const price = p.source === 'static' 
                    ? parseFloat(p.price.replace('$', ''))
                    : parseFloat(p.price.replace('$', ''))
                  
                  add({
                    id: p.id,
                    name: p.name,
                    price: price,
                    image: p.image
                  })
                  onAddToCart(p.name)
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                aria-label={`Add ${p.name} to cart`}
                disabled={p.source === 'database' && p.stock === 0}
              >
                {p.source === 'database' && p.stock === 0 ? 'Out of Stock' : 'Add to cart'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
