"use client"

import Link from "next/link"
import { ShoppingBag, User, LogOut, Search, Heart, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { useCurrency, type Currency } from "@/components/currency-context"
import { useLanguage, type Language } from "@/components/language-context"
import AuthModal from "@/components/auth-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface SearchResult {
  type: 'product' | 'category' | 'subcategory'
  id: string
  name: string
  image?: string
  price?: string
  url: string
}

export default function Navbar({ cartCount }: { cartCount: number }) {
  const { count } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const { currency, setCurrency } = useCurrency()
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const isHomePage = pathname === '/'
  const [isInHero, setIsInHero] = useState(isHomePage)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // If not on home page, navbar should be fully visible immediately
    if (!isHomePage) {
      setIsInHero(false)
      return
    }

    // Only apply hero effects on home page
    const handleScroll = () => {
      // Hero section is min-h-[50vh], so roughly 50% of viewport height
      const heroHeight = window.innerHeight * 0.5
      const scrollY = window.scrollY
      setIsInHero(scrollY < heroHeight)
    }

    // Check initial position
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const performSearch = async () => {
      setIsSearching(true)
      try {
        const query = searchQuery.toLowerCase().trim()
        const results: SearchResult[] = []

        // Search products
        const productsRes = await fetch('/api/products/upload')
        const productsData = await productsRes.json()
        if (productsData.success && productsData.products) {
          const matchingProducts = productsData.products.filter((product: any) =>
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query)
          )
          matchingProducts.forEach((product: any) => {
            results.push({
              type: 'product',
              id: product._id,
              name: product.name,
              image: product.images?.[0],
              price: `$${product.price}`,
              url: `/products/${product._id}`
            })
          })
        }

        // Search main categories
        const categoriesRes = await fetch('/api/categories/main')
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success && categoriesData.categories) {
          const matchingCategories = categoriesData.categories.filter((category: any) =>
            category.name.toLowerCase().includes(query)
          )
          matchingCategories.forEach((category: any) => {
            const categorySlug = category.name.toLowerCase()
            results.push({
              type: 'category',
              id: category._id,
              name: category.name,
              image: category.image,
              url: `/collection/${categorySlug}`
            })
          })
        }

        // Search sub categories
        const subCategoriesRes = await fetch('/api/categories/sub')
        const subCategoriesData = await subCategoriesRes.json()
        if (subCategoriesData.success && subCategoriesData.subCategories) {
          const matchingSubCategories = subCategoriesData.subCategories.filter((subCategory: any) =>
            subCategory.name.toLowerCase().includes(query) ||
            subCategory.mainCategory?.toLowerCase().includes(query)
          )
          matchingSubCategories.forEach((subCategory: any) => {
            const mainCategorySlug = subCategory.mainCategory?.toLowerCase() || 'mens'
            results.push({
              type: 'subcategory',
              id: subCategory._id,
              name: `${subCategory.mainCategory} - ${subCategory.name}`,
              image: subCategory.image,
              url: `/collection/${mainCategorySlug}`
            })
          })
        }

        setSearchResults(results.slice(0, 10)) // Limit to 10 results
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleSearchResultClick = (url: string) => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
    router.push(url)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      // Focus input when opening
      setTimeout(() => {
        const input = document.getElementById('search-input')
        input?.focus()
      }, 100)
    } else {
      // Clear search when closing
      setSearchQuery("")
      setSearchResults([])
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${isInHero ? 'bg-transparent border-transparent' : 'bg-white border-b border-border'}`}>
      {/* Promotional Banner - Hidden in hero, shown after scroll */}
      {!isInHero && (
        <div className="bg-black text-white py-2 px-4">
          <div className="mx-auto max-w-7xl flex items-center justify-center">
            <p className="text-xs md:text-sm text-center">
              FREE DELIVERY ON ORDERS OVER $50 | SHOP NOW, PAY LATER WITH KLARNA
            </p>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between relative">
        {/* Left Side - Mobile Menu & Navigation Links */}
        <div 
          className={`flex items-center gap-4 transition-all duration-700 ease-out flex-1 max-w-[calc(50%-120px)] ${
            isInHero 
              ? '-translate-x-full opacity-0 lg:opacity-0' 
              : 'translate-x-0 opacity-100'
          } ${language !== 'en' ? 'lg:pl-12 xl:pl-16' : ''}`}
        >
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden text-foreground/70 hover:text-foreground transition-colors flex-shrink-0" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                <Link href="/" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t('Home')}
                </Link>
                <Link href="/shop" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t('Shop')}
                </Link>
                <Link href="/collection" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t('Collection')}
                </Link>
                <Link href="/our-story" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t('Our Story')}
                </Link>
                <Link href="/contact" className="block text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t('Contact')}
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5 min-w-0">
            <Link 
              href="/" 
              className={`relative text-xs xl:text-sm font-medium uppercase tracking-wide transition-colors group whitespace-nowrap ${
                pathname === '/' ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {t('Home')}
              <span 
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
            <Link 
              href="/shop" 
              className={`relative text-xs xl:text-sm font-medium uppercase tracking-wide transition-colors group whitespace-nowrap ${
                pathname === '/shop' ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {t('Shop')}
              <span 
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  pathname === '/shop' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
            <Link 
              href="/collection" 
              className={`relative text-xs xl:text-sm font-medium uppercase tracking-wide transition-colors group whitespace-nowrap ${
                pathname === '/collection' ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {t('Collection')}
              <span 
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  pathname === '/collection' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
            <Link 
              href="/our-story" 
              className={`relative text-xs xl:text-sm font-medium uppercase tracking-wide transition-colors group whitespace-nowrap ${
                pathname === '/our-story' ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {t('Our Story')}
              <span 
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  pathname === '/our-story' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
            <Link 
              href="/contact" 
              className={`relative text-xs xl:text-sm font-medium uppercase tracking-wide transition-colors group whitespace-nowrap ${
                pathname === '/contact' ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {t('Contact')}
              <span 
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  pathname === '/contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
          </div>
        </div>

        {/* Center - Logo - Always visible */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 group" aria-label="Walnut Leather home">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 ${isInHero ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary'}`}>
            <span className={`font-bold text-sm ${isInHero ? 'text-white' : 'text-primary-foreground'}`}>W</span>
          </div>
          <span className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 group-hover:text-primary ${isInHero ? 'text-foreground' : 'text-foreground'}`}>
            Walnut Leather
          </span>
        </Link>

        {/* Right Side - Icons and Dropdowns */}
        <div 
          className={`flex items-center gap-4 lg:gap-6 transition-all duration-500 ease-out relative flex-1 justify-end max-w-[calc(50%-120px)] ${
            isInHero 
              ? 'translate-x-full opacity-0' 
              : 'translate-x-0 opacity-100'
          }`}
        >
          {/* Search Icon */}
          <button
            onClick={toggleSearch}
            className={`text-foreground/70 hover:text-foreground transition-colors relative z-50 ${
              isSearchOpen ? 'text-foreground' : ''
            }`}
            aria-label="Search"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Search Dialog - Slides out from search button */}
          <div
            className={`absolute right-0 bg-white border border-border shadow-lg z-40 transition-all duration-500 ease-out overflow-hidden ${
              isSearchOpen
                ? 'translate-x-0 opacity-100 w-[400px]'
                : 'translate-x-full opacity-0 w-0 pointer-events-none'
            }`}
            style={{ top: 'calc(100% + 0.5rem)' }}
          >
            <div className="p-4">
              <div className="relative">
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 text-sm pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                  {isSearching ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSearchResultClick(result.url)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                        >
                          {result.image && (
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={result.image}
                                alt={result.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-primary uppercase">
                                {result.type}
                              </span>
                              {result.price && (
                                <span className="text-sm font-semibold text-foreground">
                                  {result.price}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                              {result.name}
                            </p>
                          </div>
                          <Search className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Other Icons */}
          <div className="flex items-center gap-4 lg:gap-6">

            {/* Account Icon */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-foreground/70 hover:text-foreground transition-colors"
                    aria-label="Account"
                  >
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => router.push("/my-accounts")}>
                    <User className="h-4 w-4 mr-2" />
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Login"
              >
                <User className="h-5 w-5" />
              </button>
            )}

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="text-foreground/70 hover:text-foreground transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span
                  className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full text-xs font-bold flex items-center justify-center bg-primary text-primary-foreground"
                  aria-label={`${count} items in cart`}
                >
                  {count}
                </span>
              )}
            </Link>

            {/* Currency Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
                  <span>{currency} ({currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrency('USD')}>USD ($)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('EUR')}>EUR (€)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('GBP')}>GBP (£)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
                  <span>{language === 'en' ? 'English' : language === 'es' ? 'Español' : 'Français'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')}>Español</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fr')}>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />

    </header>
  )
}
