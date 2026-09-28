"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useWishlist } from "@/components/wishlist-context"
import { useCurrency } from "@/components/currency-context"
import { useLanguage } from "@/components/language-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const { items, removeItem, loading } = useWishlist()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleRemoveFromWishlist = async (productId: string, productName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await removeItem(productId)
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading wishlist...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {items.length === 0 
              ? "Your wishlist is empty" 
              : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved in this session`}
          </p>
        </div>

        {/* Wishlist Items */}
        {items.length === 0 ? (
          <div className="text-center py-16 border rounded-2xl bg-white shadow-sm">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">{t('Your wishlist is empty')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('Start adding items you love to your wishlist.')}
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90">{t('Browse Products')}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link 
                key={item._id}
                href={`/products/${item.productId}`}
                className="group relative bg-white hover:bg-[#111111] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={item.productImage || "/placeholder.svg"}
                    alt={item.productName}
                    className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-500"
                    loading="lazy"
                  />
                  
                  {/* Same image for hover effect */}
                  <img
                    src={item.productImage || "/placeholder.svg"}
                    alt={item.productName}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    loading="lazy"
                  />
                  
                  {/* Heart Icon - Top Right */}
                  <button
                    onClick={(e) => handleRemoveFromWishlist(item.productId, item.productName, e)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200"
                    aria-label="Remove from wishlist"
                  >
                    <Heart 
                      className="h-5 w-5 fill-red-500 text-red-500"
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  {/* Category */}
                  {item.productCategory && (
                    <p className="text-xs font-medium text-muted-foreground group-hover:text-white/70 uppercase tracking-wide transition-colors duration-300">
                      {item.productCategory}
                    </p>
                  )}

                  {/* Product Name */}
                  <h3 className="font-semibold text-foreground group-hover:text-white line-clamp-2 transition-colors duration-300">
                    {item.productName}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary group-hover:text-[#c4a47c] transition-colors duration-300">
                      {formatPrice(item.productPrice)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
