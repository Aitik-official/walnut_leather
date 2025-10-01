"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Filter, X, Search, SortAsc } from "lucide-react"
import DynamicProductGrid from "@/components/dynamic-product-grid"

interface FilterOptions {
  category: string
  size: string
  color: string
  material: string
  priceRange: number[]
  searchTerm: string
  sortBy: string
  showInStock: boolean
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "jackets", label: "Jackets" },
  { value: "bags", label: "Bags" },
  { value: "wallets", label: "Wallets" },
  { value: "belts", label: "Belts" },
  { value: "accessories", label: "Accessories" }
]

const SIZES = [
  { value: "all", label: "All Sizes" },
  { value: "XXS", label: "XXS" },
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "2XL", label: "2XL" },
  { value: "3XL", label: "3XL" },
  { value: "4XL", label: "4XL" },
  { value: "custom", label: "Custom" }
]

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" }
]

export default function ShopPage() {
  const { toast } = useToast()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    size: "all",
    color: "",
    material: "",
    priceRange: [0, 1000],
    searchTerm: "",
    sortBy: "featured",
    showInStock: false
  })

  function handleAddToCart(name: string) {
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    })
  }

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      size: "all",
      color: "",
      material: "",
      priceRange: [0, 1000],
      searchTerm: "",
      sortBy: "featured",
      showInStock: false
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category !== "all") count++
    if (filters.size !== "all") count++
    if (filters.color) count++
    if (filters.material) count++
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) count++
    if (filters.searchTerm) count++
    if (filters.showInStock) count++
    return count
  }

  return (
    <main className="bg-background text-foreground">
      <section className="w-full border-b border-border">
        <div className="mx-auto max-w-7xl px-2 md:px-4 lg:px-6 py-10 md:py-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-pretty"><span className="features-gradient">Shop</span></h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Discover timeless pieces crafted from premium walnut-brown leather.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-2 md:px-4 lg:px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Left Side */}
          <div className="lg:w-56 flex-shrink-0">
            <Card className="sticky top-24 h-fit mr-0">
              <CardHeader className="pb-3 px-4 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Filters</CardTitle>
                  <div className="flex items-center gap-1">
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden p-1"
                    >
                      <Filter className="h-3 w-3" />
                    </Button>
                    {getActiveFiltersCount() > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs px-1 py-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className={`space-y-3 px-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div className="space-y-1">
                  <Label htmlFor="search" className="text-sm">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search..."
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-1">
                  <Label className="text-sm">Category</Label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Filter */}
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={filters.size} onValueChange={(value) => handleFilterChange('size', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Filter */}
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Brown, Black, Tan"
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                  />
                </div>

                {/* Material Filter */}
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    placeholder="e.g., Genuine Leather, Suede"
                    value={filters.material}
                    onChange={(e) => handleFilterChange('material', e.target.value)}
                  />
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="space-y-4">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                      max={1000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* In Stock Only */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.showInStock}
                    onChange={(e) => handleFilterChange('showInStock', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="inStock" className="text-sm">In Stock Only</Label>
                </div>

                {/* Quick Filters */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quick Filters</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filters.category === "jackets" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('category', filters.category === "jackets" ? "all" : "jackets")}
                      className="text-xs"
                    >
                      Jackets
                    </Button>
                    <Button
                      variant={filters.category === "bags" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('category', filters.category === "bags" ? "all" : "bags")}
                      className="text-xs"
                    >
                      Bags
                    </Button>
                    <Button
                      variant={filters.category === "wallets" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('category', filters.category === "wallets" ? "all" : "wallets")}
                      className="text-xs"
                    >
                      Wallets
                    </Button>
                    <Button
                      variant={filters.category === "belts" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('category', filters.category === "belts" ? "all" : "belts")}
                      className="text-xs"
                    >
                      Belts
                    </Button>
                  </div>
                </div>

                {/* Price Ranges */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Price Ranges</Label>
                  <div className="space-y-2">
                    {[
                      { label: "Under $200", range: [0, 200] },
                      { label: "$200 - $400", range: [200, 400] },
                      { label: "$400 - $600", range: [400, 600] },
                      { label: "Over $600", range: [600, 1000] }
                    ].map((priceRange) => (
                      <Button
                        key={priceRange.label}
                        variant={
                          filters.priceRange[0] === priceRange.range[0] && filters.priceRange[1] === priceRange.range[1]
                            ? "default" 
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleFilterChange('priceRange', priceRange.range)}
                        className="w-full justify-start text-xs"
                      >
                        {priceRange.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Size Quick Filters */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Popular Sizes</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["S", "M", "L", "XL"].map((size) => (
                      <Button
                        key={size}
                        variant={filters.size === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange('size', filters.size === size ? "all" : size)}
                        className="text-xs"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Products</h2>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-48">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>

            <DynamicProductGrid 
              onAddToCart={handleAddToCart} 
              filters={filters}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
