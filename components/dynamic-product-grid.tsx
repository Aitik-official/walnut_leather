"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  featuredNickname?: string
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
  featuredNickname?: string
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

// Placeholder descriptions for static products
const staticDescriptions: Record<string, string> = {
  "rider": "Timeless design meets modern craftsmanship. This classic rider jacket features premium full-grain leather with hand-finished edges and solid brass hardware.",
  "aviator": "Experience luxury with our shearling aviator jacket. Crafted from the finest materials, it combines warmth, comfort, and sophisticated style.",
  "bomber": "A heritage-inspired bomber jacket that blends vintage aesthetics with contemporary comfort. Perfect for casual elegance.",
  "moto": "Minimalist design philosophy meets exceptional quality. This moto jacket offers clean lines and unmatched durability.",
  "field": "Built for the modern explorer. The field jacket combines rugged functionality with refined leather craftsmanship.",
  "trucker": "Contemporary styling with classic appeal. This modern trucker jacket features premium materials and thoughtful details.",
  "biker": "Urban sophistication meets motorcycle heritage. The city biker jacket is designed for the modern lifestyle.",
  "blazer": "Elevate your wardrobe with this studio leather blazer. Professional elegance meets premium leather craftsmanship.",
}

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
        featuredNickname: product.featuredNickname,
        exclusive: product.exclusive,
        limitedTimeDeal: product.limitedTimeDeal,
        description: product.description
      })),
    // Add static products after database products
    ...staticProducts.map(product => ({
      ...product,
      source: 'static' as const,
      description: staticDescriptions[product.id] || "Premium full‑grain leather, hand‑finished with premium hardware."
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top row - 2 cards skeleton */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="lg:col-span-6 aspect-[4/3.5] rounded-lg bg-gray-200 animate-pulse overflow-hidden">
            <div className="h-full w-full bg-gray-300"></div>
          </div>
        ))}
        {/* Bottom row - 3 cards skeleton */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="lg:col-span-4 aspect-[4/3.5] rounded-lg bg-gray-200 animate-pulse overflow-hidden">
            <div className="h-full w-full bg-gray-300"></div>
          </div>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Row - 2 Cards (50% each) */}
        {combinedProducts.slice(0, 2).map((p) => (
          <article 
            key={p.id} 
            className="lg:col-span-6 group relative aspect-[4/3.5] overflow-hidden rounded-lg bg-gray-50 shadow-lg transition-transform duration-500 hover:-translate-y-1 cursor-pointer"
          >
            <Link href={`/products/${p.id}`} className="block h-full w-full">
              <div className="relative h-full w-full flex items-center justify-center bg-gray-50">
                <img
                  src={p.image || "/placeholder.svg?height=600&width=600&query=walnut%20leather%20jacket"}
                  alt={`${p.name} in walnut brown leather`}
                  className="max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                />
              </div>
              
              <div className="absolute inset-0 flex items-start p-8 sm:p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div>
                  <h3 className="text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                    {p.featured && p.featuredNickname ? p.featuredNickname : p.name}
                  </h3>
                  <span className="mt-4 block h-[4px] w-12 origin-left bg-[#785D32] transition-[width] duration-500 ease-out group-hover:w-40" />
                </div>
              </div>
            </Link>
          </article>
        ))}

        {/* Bottom Row - 3 Cards (33.33% each) */}
        {combinedProducts.slice(2, 5).map((p) => (
          <article 
            key={p.id} 
            className="lg:col-span-4 group relative aspect-[4/3.5] overflow-hidden rounded-lg bg-gray-50 shadow-lg transition-transform duration-500 hover:-translate-y-1 cursor-pointer"
          >
            <Link href={`/products/${p.id}`} className="block h-full w-full">
              <div className="relative h-full w-full flex items-center justify-center bg-gray-50">
                <img
                  src={p.image || "/placeholder.svg?height=600&width=600&query=walnut%20leather%20jacket"}
                  alt={`${p.name} in walnut brown leather`}
                  className="max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              <div className="absolute inset-0 flex items-start p-8 sm:p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div>
                  <h3 className="text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                    {p.featured && p.featuredNickname ? p.featuredNickname : p.name}
                  </h3>
                  <span className="mt-4 block h-[4px] w-12 origin-left bg-[#785D32] transition-[width] duration-500 ease-out group-hover:w-40" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
