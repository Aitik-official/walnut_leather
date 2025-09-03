"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

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

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

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

  const clear = () => setItems([])

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
