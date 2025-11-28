"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useWishlist } from "@/components/wishlist-context"
import { useAuth } from "@/components/auth-context"
import { useCurrency } from "@/components/currency-context"
import { useLanguage } from "@/components/language-context"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "@/components/auth-modal"

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
  mainCategory?: string
  subCategory?: string
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
  mainCategory?: string
  subCategory?: string
  originalPrice?: string
  availableSizes?: string[]
  color?: string
  material?: string
  stock?: number
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

// Alternate images for static products (for hover effect)
const staticProductAlternates: Record<string, string> = {
  "rider": "/walnut-leather-rider-jacket-collection.jpg",
  "aviator": "/walnut-leather-aviator-jacket-collection.jpg",
  "bomber": "/walnut-leather-bomber-jacket-collection.jpg",
  "moto": "/leather-moto-zip-jacket-studio-shot.jpg",
  "field": "/heritage-leather-field-jacket-studio.jpg",
  "trucker": "/modern-leather-trucker-jacket.jpg",
  "biker": "/walnut-leather-biker-jacket-studio.jpg",
  "blazer": "/walnut-leather-blazer-studio-shot.jpg",
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
  subCategory?: string
  mainCategory?: string
}

export default function ShopProductGrid({ 
  filters 
}: { 
  filters: FilterOptions
}) {
  const { add } = useCart()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [databaseProducts, setDatabaseProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

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

  // Combine products
  const allProducts: CombinedProduct[] = [
    ...databaseProducts.map(product => ({
      id: product._id,
      name: product.name,
      price: `$${product.price}`,
      image: product.images[0] || "/placeholder.svg",
      images: product.images.length >= 2 ? product.images : [product.images[0] || "/placeholder.svg", product.images[0] || "/placeholder.svg"],
      source: 'database' as const,
      category: product.category,
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      originalPrice: product.limitedTimeDeal ? `$${Math.round(product.price * 1.5)}` : undefined,
      availableSizes: product.availableSizes,
      color: product.color,
      material: product.material,
      stock: product.stock
    })),
    ...staticProducts.map(product => ({
      ...product,
      images: [
        product.image, 
        staticProductAlternates[product.id] || product.image
      ],
      source: 'static' as const,
      category: 'jackets'
    }))
  ]

  // Filter products based on filters
  const filteredProducts = allProducts.filter(product => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      if (!product.name.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Main category filter
    if (filters.mainCategory && product.source === 'database') {
      // Check mainCategory field or parse from category string
      const productMainCategory = product.mainCategory || product.category?.split('/')[0]
      if (productMainCategory !== filters.mainCategory) {
        return false
      }
    }

    // Sub category filter (for collection page - takes priority over category filter)
    if (filters.subCategory && product.source === 'database') {
      // Check if product matches the subcategory
      const productSubCategory = product.subCategory || product.category?.split('/')[1]
      if (productSubCategory !== filters.subCategory) {
        return false
      }
    } else if (filters.category !== "all" && product.category !== filters.category) {
      // Category filter (old format support - only if subCategory is not specified)
      return false
    }

    // Size filter
    if (filters.size !== "all") {
      if (filters.size === "custom") {
        const standardSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
        if (!product.availableSizes || !product.availableSizes.some(size => !standardSizes.includes(size))) {
          return false
        }
      } else if (!product.availableSizes || !product.availableSizes.includes(filters.size)) {
        return false
      }
    }

    // Color filter
    if (filters.color && filters.color !== "all" && (!product.color || !product.color.toLowerCase().includes(filters.color.toLowerCase()))) {
      return false
    }

    // Material filter
    if (filters.material && filters.material !== "all" && (!product.material || !product.material.toLowerCase().includes(filters.material.toLowerCase()))) {
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
    switch (filters.sortBy) {
      case 'price-low':
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
      case 'price-high':
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
      case 'name-a-z':
        return a.name.localeCompare(b.name)
      case 'name-z-a':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  const toggleFavorite = async (product: CombinedProduct, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    try {
      if (isInWishlist(product.id)) {
        await removeItem(product.id)
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        await addItem(
          product.id,
          product.name,
          parseFloat(product.price.replace('$', '')),
          product.image,
          product.category
        )
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update wishlist.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg overflow-hidden aspect-[3/4]">
            <div className="h-full w-full bg-gray-300"></div>
          </div>
        ))}
      </div>
    )
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {sortedProducts.map((product) => {
        // Extract numeric price (handle formats like "$100" or "100")
        const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''))
        const numericOriginalPrice = product.originalPrice ? parseFloat(product.originalPrice.replace(/[^0-9.]/g, '')) : null
        const isFavorite = isInWishlist(product.id)

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
                onClick={(e) => toggleFavorite(product, e)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200"
                aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
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
                <span className="text-lg font-bold text-blue-600 group-hover:text-[#785D32] transition-colors duration-300">
                  {formatPrice(numericPrice)}
                </span>
                {product.originalPrice && numericOriginalPrice && numericOriginalPrice > numericPrice && (
                  <span className="text-sm text-muted-foreground group-hover:text-white/60 line-through transition-colors duration-300">
                    {formatPrice(numericOriginalPrice)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      })}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  )
}

