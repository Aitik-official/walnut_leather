"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type WishlistItem = {
  _id: string
  userId?: string
  productId: string
  productName: string
  productPrice: number
  productImage: string
  productCategory?: string
  createdAt: string
}

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (
    productId: string,
    productName: string,
    productPrice: number,
    productImage: string,
    productCategory?: string
  ) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  loading: boolean
  refreshWishlist: () => Promise<void>
}

const WISHLIST_SESSION_KEY = "walnut_wishlist_session"
const SESSION_TTL_MS = 3 * 60 * 60 * 1000 // 3 hours

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from sessionStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem(WISHLIST_SESSION_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Clear if expired after 3 hours
          if (parsed.timestamp && Date.now() - parsed.timestamp > SESSION_TTL_MS) {
            sessionStorage.removeItem(WISHLIST_SESSION_KEY)
            setItems([])
          } else if (Array.isArray(parsed.items)) {
            setItems(parsed.items)
          }
        }
      }
    } catch (e) {
      console.error("Failed to restore wishlist from session:", e)
    } finally {
      setIsInitialized(true)
      setLoading(false)
    }
  }, [])

  // Persist to sessionStorage whenever items change
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return
    try {
      if (items.length === 0) {
        sessionStorage.removeItem(WISHLIST_SESSION_KEY)
      } else {
        sessionStorage.setItem(
          WISHLIST_SESSION_KEY,
          JSON.stringify({
            items,
            timestamp: Date.now(),
          })
        )
      }
    } catch (e) {
      console.error("Failed to save wishlist to session:", e)
    }
  }, [items, isInitialized])

  const addItem = async (
    productId: string,
    productName: string,
    productPrice: number,
    productImage: string,
    productCategory?: string
  ) => {
    setItems((prev) => {
      if (prev.some((item) => item.productId === productId)) {
        return prev
      }
      const newItem: WishlistItem = {
        _id: `wl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        productId,
        productName,
        productPrice,
        productImage,
        productCategory,
        createdAt: new Date().toISOString(),
      }
      return [...prev, newItem]
    })
  }

  const removeItem = async (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const isInWishlist = (productId: string): boolean => {
    return items.some((item) => item.productId === productId)
  }

  const refreshWishlist = async () => {
    // Session wishlist is always synchronized locally
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
