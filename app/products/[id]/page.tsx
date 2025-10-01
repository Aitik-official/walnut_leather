"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  ArrowLeft, 
  Star, 
  Truck, 
  Ruler, 
  Heart, 
  Share2, 
  MessageCircle,
  ChevronDown,
  Minus,
  Plus,
  X
} from "lucide-react"
import Link from "next/link"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "@/components/auth-modal"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  availableSizes?: string[]
  color?: string
  material?: string
  stock: number
  featured: boolean
  images: string[]
  videos: string[]
  createdAt: string
  updatedAt: string
}

const staticProducts = [
  {
    id: "rider",
    name: "Classic Rider Jacket",
    price: 480,
    originalPrice: 520,
    image: "/classic-walnut-leather-rider-jacket-studio.jpg",
    description: "Full-grain leather jacket with classic styling and premium hardware.",
    category: "Jackets",
    material: "Full-grain Walnut Leather",
    availableSizes: ["XS", "S", "M", "L", "XL", "2XL"],
    color: "Walnut",
    stock: 15,
    featured: true
  },
  {
    id: "aviator",
    name: "Shearling Aviator",
    price: 620,
    originalPrice: 680,
    image: "/walnut-leather-aviator-jacket-shearling-collar.jpg",
    description: "Premium aviator jacket with shearling collar for ultimate warmth.",
    category: "Jackets",
    material: "Full-grain Walnut Leather with Shearling",
    availableSizes: ["S", "M", "L", "XL", "2XL"],
    color: "Walnut",
    stock: 8,
    featured: true
  },
  {
    id: "bomber",
    name: "Heritage Bomber",
    price: 520,
    originalPrice: 580,
    image: "/minimal-brown-leather-bomber-jacket-studio.jpg",
    description: "Classic bomber jacket with modern minimalist design.",
    category: "Jackets",
    material: "Full-grain Brown Leather",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    color: "Brown",
    stock: 12,
    featured: false
  },
  {
    id: "moto",
    name: "Minimalist Moto",
    price: 540,
    originalPrice: 590,
    image: "/minimalist-walnut-leather-moto-jacket.jpg",
    description: "Clean moto jacket with streamlined design and premium details.",
    category: "Jackets",
    material: "Full-grain Walnut Leather",
    availableSizes: ["S", "M", "L", "XL", "2XL"],
    color: "Walnut",
    stock: 10,
    featured: true
  },
  {
    id: "field",
    name: "Field Jacket",
    price: 560,
    originalPrice: 610,
    image: "/heritage-leather-field-jacket-studio.jpg",
    description: "Rugged field jacket built for adventure and everyday wear.",
    category: "Jackets",
    material: "Full-grain Walnut Leather",
    availableSizes: ["XS", "S", "M", "L", "XL", "2XL"],
    color: "Walnut",
    stock: 7,
    featured: false
  },
  {
    id: "trucker",
    name: "Modern Trucker",
    price: 500,
    originalPrice: 550,
    image: "/modern-leather-trucker-jacket.jpg",
    description: "Contemporary trucker jacket with classic American styling.",
    category: "Jackets",
    material: "Full-grain Walnut Leather",
    availableSizes: ["S", "M", "L", "XL"],
    color: "Walnut",
    stock: 14,
    featured: false
  },
  {
    id: "biker",
    name: "City Biker",
    price: 590,
    originalPrice: 640,
    image: "/walnut-leather-biker-jacket-studio.jpg",
    description: "Urban biker jacket with modern design and premium construction.",
    category: "Jackets",
    material: "Full-grain Walnut Leather",
    availableSizes: ["XS", "S", "M", "L", "XL", "2XL"],
    color: "Walnut",
    stock: 9,
    featured: true
  },
  {
    id: "blazer",
    name: "Studio Leather Blazer",
    price: 610,
    originalPrice: 660,
    image: "/walnut-leather-blazer-studio-shot.jpg",
    description: "Sophisticated leather blazer for formal and casual occasions.",
    category: "Blazers",
    material: "Full-grain Walnut Leather",
    availableSizes: ["S", "M", "L", "XL", "2XL"],
    color: "Walnut",
    stock: 6,
    featured: false
  }
]

export default function ProductDetailsPage() {
  const params = useParams()
  const { add } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("Black")
  const [quantity, setQuantity] = useState(1)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      
      // First try to find in static products
      const staticProduct = staticProducts.find(p => p.id === params.id)
      if (staticProduct) {
        setProduct({
          _id: staticProduct.id,
          name: staticProduct.name,
          description: staticProduct.description,
          price: staticProduct.price,
          originalPrice: staticProduct.originalPrice,
          category: staticProduct.category,
          material: staticProduct.material,
          stock: staticProduct.stock,
          featured: staticProduct.featured,
          images: [staticProduct.image],
          videos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        setSelectedColor(staticProduct.color || "Black")
        setSelectedSize(staticProduct.availableSizes[0])
        setLoading(false)
        return
      }

      // If not found in static, try database
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setProduct(data.product)
        // Set the color from the product
        const productColor = data.product.color || "Black"
        setSelectedColor(productColor)
        // Set the first available size from the availableSizes array
        const firstAvailableSize = data.product.availableSizes && data.product.availableSizes.length > 0 
          ? data.product.availableSizes[0] 
          : "M"
        setSelectedSize(firstAvailableSize)
      } else {
        console.error("Product not found")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    add({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    })
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-stone-50/60 to-orange-50/40">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-4">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/collection" className="hover:text-foreground">Collections</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-foreground">Leather Jackets</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? "border-primary shadow-md" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {product.images.length > 4 && (
                <button className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {product.material || "Premium Leather"}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
                      Save {discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Shipping calculated at checkout.
              </p>
            </div>

            {/* Shipping Info */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4" />
              <span>Get it between Sep 17th - September 22nd</span>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="text-sm font-medium uppercase tracking-wide">SIZE</div>
              <div className="flex flex-wrap gap-2">
                {["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => {
                  const isAvailable = product?.availableSizes?.includes(size) || false
                  const isSelected = selectedSize === size
                  
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`px-4 py-2 text-sm font-medium border-2 transition-all ${
                        isSelected && isAvailable
                          ? "border-black bg-white text-black"
                          : isAvailable
                          ? "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                          : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              <button className="px-4 py-2 text-sm font-medium border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-all">
                Custom
              </button>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <div className="text-sm font-medium uppercase tracking-wide">COLOR — {product?.color || "Walnut"}</div>
              <div className="flex space-x-2">
                <button
                  className="w-8 h-8 rounded-full border-2 border-white scale-110"
                  style={{ 
                    backgroundColor: product?.color?.toLowerCase() === 'walnut' ? '#8B4513' : 
                                   product?.color?.toLowerCase() === 'brown' ? '#8B4513' : 
                                   product?.color?.toLowerCase() === 'black' ? '#000000' : 
                                   product?.color?.toLowerCase() === 'tan' ? '#D2B48C' :
                                   product?.color?.toLowerCase() === 'cognac' ? '#9F4A3C' : '#8B4513'
                  }}
                  title={product?.color || "Walnut"}
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <span className="font-medium">QUANTITY</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true)
                    } else {
                      toast({
                        title: "Added to wishlist",
                        description: `${product.name} has been added to your wishlist.`,
                      })
                    }
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>


            {/* Reviews */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">5/5</span>
                </div>
                <p className="text-sm text-muted-foreground">12 reviews</p>
                <p className="text-xs text-muted-foreground mt-1">Powered by LOOX</p>
              </CardContent>
            </Card>

            {/* Product Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Description</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="leading-relaxed">
                  {product.description || "Full-grain leather jacket crafted with premium materials and attention to detail. This piece combines timeless style with modern functionality, designed to age beautifully and provide years of reliable wear."}
                </p>
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-foreground">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Premium full-grain leather construction</li>
                    <li>Hand-finished hardware and details</li>
                    <li>Classic styling that never goes out of fashion</li>
                    <li>Built to last with superior craftsmanship</li>
                    <li>Available in multiple sizes and colors</li>
                  </ul>
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-foreground">Care Instructions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Spot clean with a damp cloth when needed</li>
                    <li>Store in a cool, dry place</li>
                    <li>Avoid excessive moisture and direct sunlight</li>
                    <li>Condition leather periodically to maintain suppleness</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Information Sections */}
            <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible>
                <CollapsibleTrigger className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200 flex items-center justify-between text-sm font-medium uppercase tracking-wide">
                  30 DAYS FREE EXCHANGE
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 py-4 bg-gray-50">
                  <p className="text-sm text-gray-700">
                    We offer a 30-day free exchange policy on all our leather products. If you're not completely satisfied with your purchase, you can exchange it for a different size, color, or style within 30 days of delivery. The item must be in original condition with tags attached.
                  </p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200 flex items-center justify-between text-sm font-medium uppercase tracking-wide">
                  SHIPPING INFORMATION
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 py-4 bg-gray-50">
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><strong>Free Shipping:</strong> On all orders over $100</p>
                    <p><strong>Standard Shipping:</strong> 3-5 business days ($9.99)</p>
                    <p><strong>Express Shipping:</strong> 1-2 business days ($19.99)</p>
                    <p><strong>International:</strong> 7-14 business days ($29.99)</p>
                    <p className="text-xs text-gray-500 mt-2">*Shipping times may vary during peak seasons</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200 flex items-center justify-between text-sm font-medium uppercase tracking-wide">
                  CARE DETAILS
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 py-4 bg-gray-50">
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><strong>Cleaning:</strong> Use a soft, dry cloth to remove dust and dirt. For deeper cleaning, use a leather cleaner specifically designed for your leather type.</p>
                    <p><strong>Conditioning:</strong> Apply leather conditioner every 3-6 months to maintain suppleness and prevent cracking.</p>
                    <p><strong>Storage:</strong> Store in a cool, dry place away from direct sunlight. Use a breathable garment bag for long-term storage.</p>
                    <p><strong>Protection:</strong> Apply a leather protector spray to help repel water and stains.</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-sm font-medium uppercase tracking-wide">
                  ASK A QUESTION
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 py-4 bg-gray-50">
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>Have a question about this product? Our customer service team is here to help!</p>
                    <div className="space-y-2">
                      <p><strong>Email:</strong> support@walnuttleather.com</p>
                      <p><strong>Phone:</strong> 1-800-WALNUT-1</p>
                      <p><strong>Live Chat:</strong> Available 9 AM - 6 PM EST</p>
                    </div>
                    <p className="text-xs text-gray-500">We typically respond within 2 hours during business hours.</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>


      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-black hover:bg-black/90 text-white rounded-full w-16 h-16 p-0 relative">
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">1</span>
          </div>
        </Button>
      </div>

      {/* Size Chart Modal */}
      <dialog id="size-chart-modal" className="backdrop:bg-black/50 bg-transparent p-0 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Size Chart</h2>
            <button
              onClick={() => {
                const modal = document.getElementById('size-chart-modal')
                if (modal) {
                  (modal as HTMLDialogElement).close()
                }
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Size Chart Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">SIZES in CMS</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">XXS</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">XS</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">S</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">M</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">L</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">XL</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">2XL</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">3XL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Chest</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">107</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">112</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">117</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">122</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">127</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">132</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">137</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">142</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Sleeves</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">66</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">67</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">68</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">69</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">70</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">71</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">71</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">71.5</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Shoulder</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">46.5</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">48</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">49.5</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">51</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">52.5</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">53.5</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">55.5</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">56.5</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Hips</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">102</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">106</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">112</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">117</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">122</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">127</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">132</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">137</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Length</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">65</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">66</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">67</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">67.5</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">68.5</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">71</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">71.5</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">72</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Waist</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">99</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">104</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">109</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">114</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">119</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">124</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">130</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">136</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center">
            <Button
              onClick={() => {
                const modal = document.getElementById('size-chart-modal')
                if (modal) {
                  (modal as HTMLDialogElement).close()
                }
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        </div>
      </dialog>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-[60]">
          <div className="flex items-center justify-center min-h-screen p-4 pt-32">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Product</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/products/${product?._id}`
                    const text = `Check out this amazing ${product?.name} from Walnut Leather!`
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
                    setShowShareModal(false)
                  }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 w-full"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">W</span>
                  </div>
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/products/${product?._id}`
                    const text = `Check out this amazing ${product?.name} from Walnut Leather!`
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank')
                    setShowShareModal(false)
                  }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 w-full"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">f</span>
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/products/${product?._id}`
                    const text = `Check out this amazing ${product?.name} from Walnut Leather!`
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                    setShowShareModal(false)
                  }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 w-full"
                >
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">t</span>
                  </div>
                  <span className="text-sm font-medium">Twitter</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/products/${product?._id}`
                    const text = `Check out this amazing ${product?.name} from Walnut Leather!`
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
                    setShowShareModal(false)
                  }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 w-full"
                >
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">in</span>
                  </div>
                  <span className="text-sm font-medium">LinkedIn</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/products/${product?._id}`
                    navigator.clipboard.writeText(url)
                    toast({
                      title: "Link copied!",
                      description: "Product link has been copied to clipboard.",
                    })
                    setShowShareModal(false)
                  }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 w-full"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📋</span>
                  </div>
                  <span className="text-sm font-medium">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          toast({
            title: "Added to wishlist",
            description: `${product?.name} has been added to your wishlist.`,
          })
        }}
      />
    </div>
  )
}
