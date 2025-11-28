"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export type WishlistItem = {
  _id: string
  userId: string
  productId: string
  productName: string
  productPrice: number
  productImage: string
  productCategory?: string
  createdAt: string
}

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (productId: string, productName: string, productPrice: number, productImage: string, productCategory?: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  loading: boolean
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    if (!isAuthenticated || !user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/wishlist')
      const data = await response.json()
      
      if (data.success) {
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [isAuthenticated, user])

  const addItem = async (productId: string, productName: string, productPrice: number, productImage: string, productCategory?: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to add items to wishlist')
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          productPrice,
          productImage,
          productCategory,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchWishlist()
      } else {
        throw new Error(data.error || 'Failed to add item to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      throw error
    }
  }

  const removeItem = async (productId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to remove items from wishlist')
    }

    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchWishlist()
      } else {
        throw new Error(data.error || 'Failed to remove item from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      throw error
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId)
  }

  const refreshWishlist = async () => {
    await fetchWishlist()
  }

  const value = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    loading,
    refreshWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}

