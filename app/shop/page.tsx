import type { Metadata } from "next"
import ProductGrid from "@/components/product-grid"

export const metadata: Metadata = {
  title: "Shop | Walnut Leather",
  description: "Explore our collection of premium leather jackets crafted to last.",
}

export default function ShopPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="w-full border-b border-border">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-10 md:py-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-pretty"><span className="features-gradient">Shop</span></h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Discover timeless pieces crafted from premium walnut-brown leather.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-8 md:py-12" id="products">
        <ProductGrid onAddToCart={() => {}} />
      </section>
    </main>
  )
}
