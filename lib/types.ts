// Global types for the application

export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  category: 'jackets' | 'bags' | 'wallets' | 'belts' | 'accessories'
  availableSizes?: string[]
  color?: string
  material?: string
  stock: number
  featured: boolean
  exclusive: boolean
  limitedTimeDeal: boolean
  images: string[]
  videos: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  availableSizes: string[]
  color: string
  material: string
  stock: number
  featured: boolean
  exclusive: boolean
  limitedTimeDeal: boolean
  images: File[]
  videos: File[]
  imageUrls: string[]
  videoUrls: string[]
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ProductsResponse {
  success: boolean
  products: Product[]
  pagination: PaginationInfo
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
}

export interface User {
  _id?: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id?: string
  userId: string
  products: {
    productId: string
    quantity: number
    price: number
  }[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}
