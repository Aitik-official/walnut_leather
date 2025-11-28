"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
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
  images: string[]
  source: 'static' | 'database'
  category?: string
  originalPrice?: string
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
]

// Alternate images for static products (for hover effect)
const staticProductAlternates: Record<string, string> = {
  "rider": "/walnut-leather-rider-jacket-collection.jpg",
  "aviator": "/walnut-leather-aviator-jacket-collection.jpg",
  "bomber": "/walnut-leather-bomber-jacket-collection.jpg",
  "moto": "/leather-moto-zip-jacket-studio-shot.jpg",
}

export default function BestSellers() {
  const { add } = useCart()
  const [databaseProducts, setDatabaseProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchDatabaseProducts()
  }, [])

  const fetchDatabaseProducts = async () => {
    try {
      const response = await fetch('/api/products/upload')
      const data = await response.json()
      
      if (data.success) {
        setDatabaseProducts(data.products || [])
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Combine products - prioritize database products with featured flag
  const allProducts: CombinedProduct[] = [
    ...databaseProducts
      .filter(p => p.featured || p.limitedTimeDeal)
      .map(product => ({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        image: product.images[0] || "/placeholder.svg",
        images: product.images.length >= 2 ? product.images : [product.images[0] || "/placeholder.svg", product.images[0] || "/placeholder.svg"],
        source: 'database' as const,
        category: product.category,
        originalPrice: product.limitedTimeDeal ? `$${Math.round(product.price * 1.5)}` : undefined
      })),
    ...staticProducts.map(product => ({
      ...product,
      images: [
        product.image, 
        staticProductAlternates[product.id] || product.image // Use alternate image if available, otherwise same image
      ],
      source: 'static' as const,
      category: 'jackets'
    }))
  ]

  // Get best sellers (featured products or first 4)
  const bestSellers = allProducts.slice(0, 4)

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg overflow-hidden aspect-[3/4]">
            <div className="h-full w-full bg-gray-300"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {bestSellers.map((product) => {
        const numericPrice = parseFloat(product.price.replace('$', ''))
        const numericOriginalPrice = product.originalPrice ? parseFloat(product.originalPrice.replace('$', '')) : null
        const isFavorite = favorites.has(product.id)

        return (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="group relative bg-white hover:bg-[#111111] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              {/* First Image - Always visible */}
              <img
                src={product.images[0] || product.image || "/placeholder.svg"}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-500"
                loading="lazy"
              />
              
              {/* Second Image - Fades in on hover */}
              <img
                src={product.images[1] || product.image || "/placeholder.svg"}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                loading="lazy"
              />
              
              {/* Heart Icon - Top Right */}
              <button
                onClick={(e) => toggleFavorite(product.id, e)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200"
                aria-label="Add to favorites"
              >
                <Heart 
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
              {/* Category/Brand */}
              {product.category && (
                <p className="text-xs font-medium text-muted-foreground group-hover:text-white/70 uppercase tracking-wide transition-colors duration-300">
                  {product.category}
                </p>
              )}

              {/* Product Name */}
              <h3 className="font-semibold text-foreground group-hover:text-white line-clamp-2 transition-colors duration-300">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#18651b] group-hover:text-[#785D32] transition-colors duration-300">
                  {product.price}
                </span>
                {product.originalPrice && numericOriginalPrice && numericOriginalPrice > numericPrice && (
                  <span className="text-sm text-muted-foreground group-hover:text-white/60 line-through transition-colors duration-300">
                    {product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

