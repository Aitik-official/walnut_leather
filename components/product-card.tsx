"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-context"

type Product = {
  id: string
  name: string
  price: number
  image: string
  color: string
  material: string
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={`${product.name} in ${product.color}`}
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.material}</p>
          </div>
          <p className="font-medium">${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() =>
            add({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            })
          }
          aria-label={`Add ${product.name} to cart`}
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  )
}
