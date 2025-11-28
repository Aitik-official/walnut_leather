"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import ShopProductGrid from "@/components/shop-product-grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface SubCategory {
  _id: string
  name: string
  mainCategory: string
  image: string
  createdAt: string
  updatedAt: string
}

interface FilterOptions {
  category: string
  size: string
  color: string
  material: string
  priceRange: number[]
  searchTerm: string
  sortBy: string
  showInStock: boolean
  subCategory?: string
  mainCategory?: string
}

export default function CategoryCollectionPage() {
  const params = useParams()
  const category = params.category as string
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Map category param to main category name
  const mainCategoryName = category === 'mens' ? 'Mens' : category === 'womens' ? 'Womens' : category
  const categoryTitle = category === 'mens' ? "Men's Jackets" : category === 'womens' ? "Women's Jackets" : category

  useEffect(() => {
    fetchSubCategories()
  }, [category])

  const fetchSubCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/categories/sub?mainCategory=${mainCategoryName}`)
      const data = await response.json()
      
      if (data.success) {
        setSubcategories(data.subCategories || [])
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent, subCategoryName: string) => {
    e.preventDefault()
    
    // Set active card to trigger top border animation
    setActiveCard(subCategoryName)
    
    // Wait for top border animation to complete
    setTimeout(() => {
      setSelectedSubCategory(subCategoryName)
      setActiveCard(null)
      // Scroll to products section
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 900)
  }

  const handleBackToCategories = () => {
    setSelectedSubCategory(null)
    setActiveCard(null)
    setHoveredCard(null)
  }

  // Create filter options for ShopProductGrid
  const productFilters: FilterOptions = {
    category: "all",
    size: "all",
    color: "all",
    material: "all",
    priceRange: [0, 1000],
    searchTerm: "",
    sortBy: "featured",
    showInStock: false,
    subCategory: selectedSubCategory || undefined,
    mainCategory: mainCategoryName
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-4">
        <nav className="text-sm text-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/collection" className="hover:text-primary transition-colors">
            Collection
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{categoryTitle}</span>
          {selectedSubCategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-foreground">{selectedSubCategory}</span>
            </>
          )}
        </nav>
      </div>

      {!selectedSubCategory ? (
        /* Category Grid Section - Subcategories */
        <section className="px-4 md:px-8 lg:px-12 py-20">
          <div className="mx-auto w-full max-w-[1800px]">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            ) : subcategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No subcategories available for {categoryTitle}</p>
              </div>
            ) : (
              /* 3-column grid layout - maintains 3 columns for all items (3x3 if more than 3 items) */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 xl:gap-16">
                {subcategories.map((subcategory, index) => {
                  const isActive = activeCard === subcategory.name
                  const isHovered = hoveredCard === subcategory.name
                  return (
                    <article 
                      key={subcategory._id} 
                      className="group collection-card-wrapper relative aspect-[4/3.5] overflow-visible rounded-lg shadow-lg transition-transform duration-500 hover:-translate-y-1 cursor-pointer"
                      onMouseEnter={() => {
                        if (!activeCard) {
                          setHoveredCard(subcategory.name)
                        }
                      }}
                      onMouseLeave={() => {
                        if (!activeCard) {
                          setHoveredCard(null)
                        }
                      }}
                      onClick={(e) => handleCardClick(e, subcategory.name)}
                    >
                      <div className="block h-full w-full relative">
                        <div className="relative h-full w-full rounded-lg overflow-hidden">
                          <img
                            src={subcategory.image || "/placeholder.svg"}
                            alt={`${subcategory.name} - ${categoryTitle}`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading={index < 3 ? "eager" : "lazy"}
                          />
                          
                          {/* Text overlay on image - positioned in lower portion */}
                          <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-10">
                            <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white uppercase tracking-wide">
                              {subcategory.name}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Border animation effect - starts from center bottom */}
                        {/* Bottom border - expands from center to both sides */}
                        <div 
                          className="absolute bottom-0 left-1/2 h-0.5 bg-foreground"
                          style={{
                            transform: 'translateX(-50%)',
                            width: isActive ? '100%' : isHovered ? '100%' : '0%',
                            transition: isHovered 
                              ? 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s'
                              : 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.6s'
                          }}
                        />
                        
                        {/* Left border - extends upward (starts after bottom expands) */}
                        <div 
                          className="absolute bottom-0 left-0 w-0.5 bg-foreground"
                          style={{
                            height: isActive ? '100%' : isHovered ? '100%' : '0%',
                            transition: isHovered
                              ? 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
                              : 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
                          }}
                        />
                        
                        {/* Right border - extends upward (starts after bottom expands) */}
                        <div 
                          className="absolute bottom-0 right-0 w-0.5 bg-foreground"
                          style={{
                            height: isActive ? '100%' : isHovered ? '100%' : '0%',
                            transition: isHovered
                              ? 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
                              : 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
                          }}
                        />
                        
                        {/* Top border - expands from center only on click (active state) */}
                        <div 
                          className="absolute top-0 left-1/2 h-0.5 bg-foreground"
                          style={{
                            transform: 'translateX(-50%)',
                            width: isActive ? '100%' : '0%',
                            transition: isActive
                              ? 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s'
                              : 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s'
                          }}
                        />
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Products Section - Shows products for selected subcategory */
        <section className="px-4 md:px-8 lg:px-12 py-8">
          <div className="mx-auto w-full max-w-[1800px]">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToCategories}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>
            </div>

            {/* Products Grid - Same format as /shop page */}
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {categoryTitle} - {selectedSubCategory}
              </h2>
              <ShopProductGrid filters={productFilters} />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
