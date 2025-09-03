"use client"

import type React from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-context"

export default function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, increment, decrement, remove, total, clear } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4">Your cart is empty.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3">
                  <img
                    src={i.image || "/placeholder.svg"}
                    alt={i.name}
                    className="h-16 w-16 rounded-md object-cover bg-muted"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{i.name}</p>
                      <button className="text-xs text-muted-foreground hover:underline" onClick={() => remove(i.id)}>
                        Remove
                      </button>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label={`Decrease quantity for ${i.name}`}
                          className="h-7 w-7 rounded border border-border"
                          onClick={() => decrement(i.id)}
                        >
                          -
                        </button>
                        <span aria-live="polite" className="min-w-6 text-center">
                          {i.qty}
                        </span>
                        <button
                          aria-label={`Increase quantity for ${i.name}`}
                          className="h-7 w-7 rounded border border-border"
                          onClick={() => increment(i.id)}
                        >
                          +
                        </button>
                      </div>
                      <span className="font-medium">${(i.price * i.qty).toFixed(2)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <SheetFooter className="mt-4">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={items.length === 0}
              >
                Checkout
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" disabled={items.length === 0} onClick={clear}>
                Clear
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
