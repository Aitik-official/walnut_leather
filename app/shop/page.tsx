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
import { Filter, X, Search, SortAsc, ChevronDown, ChevronUp } from "lucide-react"
import ShopProductGrid from "@/components/shop-product-grid"

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

const COLORS = [
  { value: "all", label: "All Colors" },
  { value: "Walnut", label: "Walnut" },
  { value: "Brown", label: "Brown" },
  { value: "Black", label: "Black" },
  { value: "Tan", label: "Tan" },
  { value: "Cognac", label: "Cognac" },
  { value: "Burgundy", label: "Burgundy" }
]

const MATERIALS = [
  { value: "all", label: "All Materials" },
  { value: "Full-grain Leather", label: "Full-grain Leather" },
  { value: "Full-grain Walnut Leather", label: "Full-grain Walnut Leather" },
  { value: "Full-grain Brown Leather", label: "Full-grain Brown Leather" },
  { value: "Genuine Leather", label: "Genuine Leather" },
  { value: "Suede", label: "Suede" },
  { value: "Shearling", label: "Shearling" },
  { value: "Leather with Shearling", label: "Leather with Shearling" }
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
  const [showPriceRange, setShowPriceRange] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    size: "all",
    color: "all",
    material: "all",
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
      color: "all",
      material: "all",
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
    if (filters.color && filters.color !== "all") count++
    if (filters.material && filters.material !== "all") count++
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) count++
    if (filters.searchTerm) count++
    if (filters.showInStock) count++
    return count
  }

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-[1800px] px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Left Side */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-24 h-fit mr-0">
              <CardContent className={`px-4 pt-3 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Filters Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
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
                
                <div className="space-y-3">
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
                  <Label>Color</Label>
                  <Select value={filters.color || "all"} onValueChange={(value) => handleFilterChange('color', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Material Filter */}
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select value={filters.material || "all"} onValueChange={(value) => handleFilterChange('material', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIALS.map((material) => (
                        <SelectItem key={material.value} value={material.value}>
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowPriceRange(!showPriceRange)}
                    className="flex items-center justify-between w-full text-sm font-medium hover:text-foreground transition-colors"
                  >
                    <Label className="cursor-pointer">Price Range</Label>
                    {showPriceRange ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {showPriceRange && (
                    <div className="space-y-4 pt-2">
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
                      <div className="space-y-2 pt-2">
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
                  )}
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

            <ShopProductGrid 
              filters={filters}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
