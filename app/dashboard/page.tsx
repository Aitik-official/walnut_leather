"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Image, Video, Package, Save, Eye, Trash2, Plus, Edit, Eye as ViewIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminAuthModal from "@/components/admin-auth-modal"

interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  availableSizes: string[]
  color: string
  material: string
  stock: number
  featured: boolean
  images: File[]
  videos: File[]
}

interface DatabaseProduct {
  _id: string
  name: string
  description: string
  price: number
  category: string
  availableSizes?: string[]
  color?: string
  material?: string
  stock: number
  featured: boolean
  images: string[]
  videos: string[]
  createdAt: string
  updatedAt: string
}

const AVAILABLE_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']

export default function DashboardPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<DatabaseProduct | null>(null)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [existingVideos, setExistingVideos] = useState<string[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [removedVideos, setRemovedVideos] = useState<string[]>([])
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    availableSizes: [],
    color: "",
    material: "",
    stock: 0,
    featured: false,
    exclusive: false,
    limitedTimeDeal: false,
    images: [],
    videos: [],
    imageUrls: [],
    videoUrls: []
  })
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [videoUrlInput, setVideoUrlInput] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/auth/admin-me')
      const data = await response.json()
      
      if (data.success && data.user) {
        setIsAuthenticated(true)
        fetchProducts()
      } else {
        setShowAuthModal(true)
      }
    } catch (error) {
      setShowAuthModal(true)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/upload')
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size)
        ? prev.availableSizes.filter(s => s !== size)
        : [...prev.availableSizes, size]
    }))
  }

  const handleCustomSize = () => {
    const customSize = prompt('Enter custom size:')
    if (customSize && !formData.availableSizes.includes(customSize)) {
      setFormData(prev => ({
        ...prev,
        availableSizes: [...prev.availableSizes, customSize]
      }))
    }
  }

  const handleEditProduct = (product: DatabaseProduct) => {
    setEditingProduct(product)
    setExistingImages(product.images || [])
    setExistingVideos(product.videos || [])
    setRemovedImages([])
    setRemovedVideos([])
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      availableSizes: product.availableSizes || [],
      color: product.color || "",
      material: product.material || "",
      stock: product.stock,
      featured: product.featured,
      exclusive: product.exclusive || false,
      limitedTimeDeal: product.limitedTimeDeal || false,
      images: [],
      videos: []
    })
    setShowEditForm(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: "Product deleted successfully",
        })
        fetchProducts() // Refresh the products list
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete product",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleFileUpload = (type: 'images' | 'videos', files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...newFiles]
    }))
  }

  const removeFile = (type: 'images' | 'videos', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index]
    setRemovedImages(prev => [...prev, imageToRemove])
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingVideo = (index: number) => {
    const videoToRemove = existingVideos[index]
    setRemovedVideos(prev => [...prev, videoToRemove])
    setExistingVideos(prev => prev.filter((_, i) => i !== index))
  }

  const restoreImage = (imageUrl: string) => {
    setRemovedImages(prev => prev.filter(img => img !== imageUrl))
    setExistingImages(prev => [...prev, imageUrl])
  }

  const restoreVideo = (videoUrl: string) => {
    setRemovedVideos(prev => prev.filter(vid => vid !== videoUrl))
    setExistingVideos(prev => [...prev, videoUrl])
  }

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return
    
    if (!validateUrl(imageUrlInput)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive"
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, imageUrlInput.trim()]
    }))
    setImageUrlInput("")
  }

  const addVideoUrl = () => {
    if (!videoUrlInput.trim()) return
    
    if (!validateUrl(videoUrlInput)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid video URL",
        variant: "destructive"
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      videoUrls: [...prev.videoUrls, videoUrlInput.trim()]
    }))
    setVideoUrlInput("")
  }

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const removeVideoUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()
      
      // Add text data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('category', formData.category)
      formDataToSend.append('availableSizes', JSON.stringify(formData.availableSizes))
      formDataToSend.append('color', formData.color)
      formDataToSend.append('material', formData.material)
      formDataToSend.append('stock', formData.stock.toString())
      formDataToSend.append('featured', formData.featured.toString())
      formDataToSend.append('exclusive', formData.exclusive.toString())
      formDataToSend.append('limitedTimeDeal', formData.limitedTimeDeal.toString())

      // Add images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image)
      })

      // Add videos
      formData.videos.forEach((video, index) => {
        formDataToSend.append(`videos`, video)
      })

      // Add image URLs
      formData.imageUrls.forEach((url) => {
        formDataToSend.append('imageUrls', url)
      })

      // Add video URLs
      formData.videoUrls.forEach((url) => {
        formDataToSend.append('videoUrls', url)
      })

      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      if (result.warning) {
        toast({
          title: "Upload Successful with Warning",
          description: result.warning,
          variant: "default"
        })
      } else {
        toast({
          title: "Success!",
          description: "Product uploaded successfully",
        })
      }

      // Reset form and refresh products
        setFormData({
          name: "",
          description: "",
          price: 0,
          category: "",
          availableSizes: [],
          color: "",
          material: "",
          stock: 0,
          featured: false,
          exclusive: false,
          limitedTimeDeal: false,
          images: [],
          videos: [],
          imageUrls: [],
          videoUrls: []
        })
      setUploadProgress(0)
      setShowAddForm(false)
      fetchProducts() // Refresh the products list

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload product. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <AdminAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsAuthenticated(true)
          fetchProducts()
        }}
      />
    )
  }

  return (
    <div className="w-full h-full">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="features-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Manage your leather products</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">{products.filter(p => p.stock > 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Featured Products</p>
                <p className="text-2xl font-bold">{products.filter(p => p.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{products.filter(p => p.stock === 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Products Table */}
        <div>
        <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first product</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PRODUCT</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead>PRICE</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {product._id.slice(-8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {product.featured && (
                          <Badge variant="default" className="bg-green-100 text-green-800">NEW</Badge>
                        )}
                        {product.stock === 0 && (
                          <Badge variant="destructive">OUT OF STOCK</Badge>
                        )}
                        {product.stock > 0 && product.stock < 5 && (
                          <Badge variant="destructive" className="bg-red-100 text-red-800">LOW STOCK</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`/products/${product._id}`, '_blank')}
                          title="View Product"
                        >
                          <ViewIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProduct(product._id)}
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        </Card>
        </div>
      </div>

      {/* Add Product Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add New Product</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAddForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>

        {/* Upload Form */}
        <Card className="shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Add New Product
            </CardTitle>
            <CardDescription>
              Fill in the product details and upload images/videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Premium Brown Leather Jacket"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="299.99"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the product features, quality, and craftsmanship..."
                  rows={4}
                  required
                />
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jackets">Jackets</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="wallets">Wallets</SelectItem>
                      <SelectItem value="belts">Belts</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="space-y-3">
                    {/* Standard Sizes */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {AVAILABLE_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`
                            px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                            ${formData.availableSizes.includes(size)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                            }
                          `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Size Button */}
                    <div className="flex justify-start">
                      <button
                        type="button"
                        onClick={handleCustomSize}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Custom
                      </button>
                    </div>
                    
                    {/* Selected Sizes Display */}
                    {formData.availableSizes.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Selected sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.availableSizes.map((size) => (
                            <span
                              key={size}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                            >
                              {size}
                              <button
                                type="button"
                                onClick={() => handleSizeToggle(size)}
                                className="hover:text-red-500"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="Brown, Black, Tan, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    placeholder="Genuine Leather, Suede, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock || ''}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Product Tags */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Product Tags</Label>
                
                {/* Featured Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                  {formData.featured && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">Featured</Badge>}
                </div>

                {/* Exclusive Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="exclusive"
                    checked={formData.exclusive}
                    onChange={(e) => handleInputChange('exclusive', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="exclusive">Exclusive Product</Label>
                  {formData.exclusive && <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">Exclusive</Badge>}
                </div>

                {/* Limited Time Deal Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="limitedTimeDeal"
                    checked={formData.limitedTimeDeal}
                    onChange={(e) => handleInputChange('limitedTimeDeal', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="limitedTimeDeal">Limited Time Deal</Label>
                  {formData.limitedTimeDeal && <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">Limited Deal</Badge>}
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                {/* Images Upload */}
                <div className="space-y-2">
                  <Label>Product Images *</Label>
                  
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Upload product images</p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload('images', e.target.files)}
                      className="max-w-xs mx-auto"
                    />
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Or add image URLs</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addImageUrl}
                        variant="outline"
                        disabled={!imageUrlInput.trim()}
                      >
                        Add URL
                      </Button>
                    </div>
                  </div>

                  {/* Uploaded Files Preview */}
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Uploaded Files</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <Image className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile('images', index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image URLs Preview */}
                  {formData.imageUrls.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Image URLs</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formData.imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                              <div className="hidden w-full h-full items-center justify-center">
                                <Image className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                            <p className="text-xs text-center mt-1 truncate">{url}</p>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImageUrl(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Videos Upload */}
                <div className="space-y-2">
                  <Label>Product Videos (Optional)</Label>
                  
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Upload product videos</p>
                    <Input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleFileUpload('videos', e.target.files)}
                      className="max-w-xs mx-auto"
                    />
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Or add video URLs</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/video.mp4"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addVideoUrl}
                        variant="outline"
                        disabled={!videoUrlInput.trim()}
                      >
                        Add URL
                      </Button>
                    </div>
                  </div>

                  {/* Uploaded Files Preview */}
                  {formData.videos.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Uploaded Files</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formData.videos.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-600 truncate">{file.name}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile('videos', index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video URLs Preview */}
                  {formData.videoUrls.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Video URLs</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formData.videoUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                              <div className="text-center">
                                <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-600 truncate">{url.split('/').pop()}</p>
                              </div>
                            </div>
                            <p className="text-xs text-center mt-1 truncate">{url}</p>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeVideoUrl(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Validation Status */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div className={`flex items-center gap-2 ${formData.name ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.name ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {formData.name ? 'Product name provided' : 'Product name required'}
                </div>
                <div className={`flex items-center gap-2 ${formData.description ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.description ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {formData.description ? 'Description provided' : 'Description required'}
                </div>
                <div className={`flex items-center gap-2 ${(formData.images.length > 0 || formData.imageUrls.length > 0) ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${(formData.images.length > 0 || formData.imageUrls.length > 0) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {(formData.images.length > 0 || formData.imageUrls.length > 0) 
                    ? `Images provided (${formData.images.length} files, ${formData.imageUrls.length} URLs)` 
                    : 'At least one image required (upload file or add URL)'}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isUploading || !formData.name || !formData.description || (formData.images.length === 0 && formData.imageUrls.length === 0)}
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Upload Product
                  </>
                )}
              </Button>
            </form>
          </CardContent>
            </Card>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Form Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingProduct(null)
                    setExistingImages([])
                    setExistingVideos([])
                    setRemovedImages([])
                    setRemovedVideos([])
        setFormData({
          name: "",
          description: "",
          price: 0,
          category: "",
          availableSizes: [],
          color: "",
          material: "",
          stock: 0,
          featured: false,
          exclusive: false,
          limitedTimeDeal: false,
          images: [],
          videos: [],
          imageUrls: [],
          videoUrls: []
        })
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>

              {/* Edit Form */}
              <Card className="shadow-xl border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Edit Product: {editingProduct.name}
                  </CardTitle>
                  <CardDescription>
                    Update the product details below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    setIsUploading(true)

                    try {
                      const formDataToSend = new FormData()
                      
                      // Add text data
                      formDataToSend.append('name', formData.name)
                      formDataToSend.append('description', formData.description)
                      formDataToSend.append('price', formData.price.toString())
                      formDataToSend.append('category', formData.category)
                      formDataToSend.append('availableSizes', JSON.stringify(formData.availableSizes))
                      formDataToSend.append('color', formData.color)
                      formDataToSend.append('material', formData.material)
                      formDataToSend.append('stock', formData.stock.toString())
                      formDataToSend.append('featured', formData.featured.toString())
                      formDataToSend.append('exclusive', formData.exclusive.toString())
                      formDataToSend.append('limitedTimeDeal', formData.limitedTimeDeal.toString())

                      // Add remaining existing images
                      existingImages.forEach((image) => {
                        formDataToSend.append('existingImages', image)
                      })

                      // Add remaining existing videos
                      existingVideos.forEach((video) => {
                        formDataToSend.append('existingVideos', video)
                      })

                      // Add removed images list
                      removedImages.forEach((image) => {
                        formDataToSend.append('removedImages', image)
                      })

                      // Add removed videos list
                      removedVideos.forEach((video) => {
                        formDataToSend.append('removedVideos', video)
                      })

                      // Add new images if any are selected
                      formData.images.forEach((image, index) => {
                        formDataToSend.append(`images`, image)
                      })

                      // Add new videos if any are selected
                      formData.videos.forEach((video, index) => {
                        formDataToSend.append(`videos`, video)
                      })

                      // Add image URLs
                      formData.imageUrls.forEach((url) => {
                        formDataToSend.append('imageUrls', url)
                      })

                      // Add video URLs
                      formData.videoUrls.forEach((url) => {
                        formDataToSend.append('videoUrls', url)
                      })

                      const response = await fetch(`/api/products/${editingProduct._id}`, {
                        method: 'PUT',
                        body: formDataToSend
                      })

                      const result = await response.json()
                      
                      if (result.success) {
                        toast({
                          title: "Success!",
                          description: "Product updated successfully",
                        })
                        setShowEditForm(false)
                        setEditingProduct(null)
                        fetchProducts()
                      } else {
                        toast({
                          title: "Error",
                          description: result.error || "Failed to update product",
                          variant: "destructive"
                        })
                      }
                    } catch (error) {
                      toast({
                        title: "Update Failed",
                        description: "Failed to update product. Please try again.",
                        variant: "destructive"
                      })
                    } finally {
                      setIsUploading(false)
                    }
                  }} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Product Name *</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="e.g., Premium Brown Leather Jacket"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Price ($) *</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={formData.price || ''}
                          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                          placeholder="299.99"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description *</Label>
                      <Textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe the product features, quality, and craftsmanship..."
                        rows={4}
                        required
                      />
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jackets">Jackets</SelectItem>
                            <SelectItem value="bags">Bags</SelectItem>
                            <SelectItem value="wallets">Wallets</SelectItem>
                            <SelectItem value="belts">Belts</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-color">Color</Label>
                        <Input
                          id="edit-color"
                          value={formData.color}
                          onChange={(e) => handleInputChange('color', e.target.value)}
                          placeholder="Brown, Black, Tan, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-material">Material</Label>
                        <Input
                          id="edit-material"
                          value={formData.material}
                          onChange={(e) => handleInputChange('material', e.target.value)}
                          placeholder="Genuine Leather, Suede, etc."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-stock">Stock Quantity</Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        value={formData.stock || ''}
                        onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                        placeholder="10"
                      />
                    </div>

                    {/* Product Tags */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Product Tags</Label>
                      
                      {/* Featured Toggle */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-featured"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="edit-featured">Featured Product</Label>
                        {formData.featured && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">Featured</Badge>}
                      </div>

                      {/* Exclusive Toggle */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-exclusive"
                          checked={formData.exclusive}
                          onChange={(e) => handleInputChange('exclusive', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="edit-exclusive">Exclusive Product</Label>
                        {formData.exclusive && <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">Exclusive</Badge>}
                      </div>

                      {/* Limited Time Deal Toggle */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-limitedTimeDeal"
                          checked={formData.limitedTimeDeal}
                          onChange={(e) => handleInputChange('limitedTimeDeal', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="edit-limitedTimeDeal">Limited Time Deal</Label>
                        {formData.limitedTimeDeal && <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">Limited Deal</Badge>}
                      </div>
                    </div>

                    {/* Available Sizes */}
                    <div className="space-y-2">
                      <Label>Available Sizes</Label>
                      <div className="space-y-3">
                        {/* Standard Sizes */}
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {AVAILABLE_SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`
                                px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                                ${formData.availableSizes.includes(size)
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                                }
                              `}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        
                        {/* Custom Size Button */}
                        <div className="flex justify-start">
                          <button
                            type="button"
                            onClick={handleCustomSize}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Custom
                          </button>
                        </div>
                        
                        {/* Selected Sizes Display */}
                        {formData.availableSizes.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Selected sizes:</p>
                            <div className="flex flex-wrap gap-1">
                              {formData.availableSizes.map((size) => (
                                <span
                                  key={size}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                                >
                                  {size}
                                  <button
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className="hover:text-red-500"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Current Images Display */}
                    {existingImages.length > 0 && (
                      <div className="space-y-2">
                        <Label>Current Images</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {existingImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={image}
                                  alt={`Product image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeExistingImage(index)}
                                title="Remove image"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Click the X button to remove images</p>
                      </div>
                    )}

                    {/* Removed Images Display */}
                    {removedImages.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-red-600">Removed Images</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {removedImages.map((image, index) => (
                            <div key={index} className="relative group opacity-50">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={image}
                                  alt={`Removed image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => restoreImage(image)}
                                title="Restore image"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Click the + button to restore images</p>
                      </div>
                    )}

                    {/* Current Videos Display */}
                    {existingVideos.length > 0 && (
                      <div className="space-y-2">
                        <Label>Current Videos</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {existingVideos.map((video, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                <div className="text-center">
                                  <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-600 truncate">{video.split('/').pop()}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeExistingVideo(index)}
                                title="Remove video"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Click the X button to remove videos</p>
                      </div>
                    )}

                    {/* Removed Videos Display */}
                    {removedVideos.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-red-600">Removed Videos</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {removedVideos.map((video, index) => (
                            <div key={index} className="relative group opacity-50">
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                <div className="text-center">
                                  <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-600 truncate">{video.split('/').pop()}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => restoreVideo(video)}
                                title="Restore video"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Click the + button to restore videos</p>
                      </div>
                    )}

                    {/* File Uploads */}
                    <div className="space-y-4">
                      {/* Images Upload */}
                      <div className="space-y-2">
                        <Label>New Product Images (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-2">Upload new product images</p>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileUpload('images', e.target.files)}
                            className="max-w-xs mx-auto"
                          />
                        </div>
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {formData.images.map((file, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Image className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeFile('images', index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Videos Upload */}
                      <div className="space-y-2">
                        <Label>New Product Videos (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-2">Upload new product videos</p>
                          <Input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={(e) => handleFileUpload('videos', e.target.files)}
                            className="max-w-xs mx-auto"
                          />
                        </div>
                        {formData.videos.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {formData.videos.map((file, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                  <div className="text-center">
                                    <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-600 truncate">{file.name}</p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeFile('videos', index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isUploading || !formData.name || !formData.description}
                    >
                      {isUploading ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Product
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
