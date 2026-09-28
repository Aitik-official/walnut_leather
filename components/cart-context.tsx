"use client"

import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  qty: number
}

type CartContextType = {
  items: CartItem[]
  add: (item: Omit<CartItem, "qty">) => void
  remove: (id: string) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  clear: () => void
  total: number
  count: number
}

const CART_SESSION_KEY = "walnut_cart_session"
const SESSION_TTL_MS = 3 * 60 * 60 * 1000 // 3 hours

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from sessionStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem(CART_SESSION_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Clear if expired after 3 hours
          if (parsed.timestamp && Date.now() - parsed.timestamp > SESSION_TTL_MS) {
            sessionStorage.removeItem(CART_SESSION_KEY)
            setItems([])
          } else if (Array.isArray(parsed.items)) {
            setItems(parsed.items)
          }
        }
      }
    } catch (e) {
      console.error("Failed to restore cart from session:", e)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Persist to sessionStorage whenever items change
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return
    try {
      if (items.length === 0) {
        sessionStorage.removeItem(CART_SESSION_KEY)
      } else {
        sessionStorage.setItem(
          CART_SESSION_KEY,
          JSON.stringify({
            items,
            timestamp: Date.now(),
          })
        )
      }
    } catch (e) {
      console.error("Failed to save cart to session:", e)
    }
  }, [items, isInitialized])

  const add = (item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p))
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))

  const increment = (id: string) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p)))

  const decrement = (id: string) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty - 1) } : p)).filter((p) => p.qty > 0),
    )

  const clear = () => {
    setItems([])
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(CART_SESSION_KEY)
      }
    } catch (e) {}
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  const value = { items, add, remove, increment, decrement, clear, total, count }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
