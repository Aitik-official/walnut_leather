"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background" id="contact">
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Walnut Leather</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed max-w-sm">
              Premium full‑grain leather goods crafted to endure and designed to impress.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-foreground">Company</h4>
            <Link className="text-muted-foreground hover:text-foreground" href="/our-story">
              Our Story
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/shop">
              Shop
            </Link>
            {/* rename label to "Collection" to match route */}
            <Link className="text-muted-foreground hover:text-foreground" href="/collection">
              Collection
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/contact">
              Support
            </Link>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Stay in the loop</h4>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Be first to know about new drops and limited runs.
            </p>
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup form"
            >
              <Input type="email" placeholder="you@example.com" aria-label="Email address" className="bg-background" />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Walnut Leather. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
