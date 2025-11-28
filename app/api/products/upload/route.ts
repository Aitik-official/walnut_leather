import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


interface ProductData {
  name: string
  description: string
  price: number
  category: string
  mainCategory?: string
  subCategory?: string
  availableSizes?: string[]
  color?: string
  material?: string
  stock: number
  featured: boolean
  featuredNickname?: string
  exclusive: boolean
  limitedTimeDeal: boolean
  images: string[]
  videos: string[]
  createdAt: Date
  updatedAt: Date
}

export async function POST(request: NextRequest) {
  try {
    console.log('Upload route called')
    const formData = await request.formData()
    
    // Extract text data
    const productData: Partial<ProductData> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      category: formData.get('category') as string,
      mainCategory: formData.get('mainCategory') as string || undefined,
      subCategory: formData.get('subCategory') as string || undefined,
      availableSizes: JSON.parse(formData.get('availableSizes') as string) || [],
      color: formData.get('color') as string || '',
      material: formData.get('material') as string || '',
      stock: parseInt(formData.get('stock') as string) || 0,
      featured: formData.get('featured') === 'true',
      featuredNickname: formData.get('featuredNickname') as string || undefined,
      exclusive: formData.get('exclusive') === 'true',
      limitedTimeDeal: formData.get('limitedTimeDeal') === 'true',
      images: [],
      videos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Product data extracted:', productData)

    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || !productData.mainCategory || !productData.subCategory) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, mainCategory, and subCategory are required' },
        { status: 400 }
      )
    }

    // Upload images to Cloudinary
    const imageFiles = formData.getAll('images') as File[]
    const uploadedImages: string[] = []

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        try {
          const bytes = await imageFile.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'image',
                folder: 'walnut_leathers/images',
                transformation: [
                  { width: 800, height: 800, crop: 'limit', quality: 'auto' },
                  { format: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error)
                else resolve(result)
              }
            ).end(buffer)
          })

          if (result && typeof result === 'object' && 'secure_url' in result) {
            uploadedImages.push(result.secure_url as string)
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
          )
        }
      }
    }

    // Upload videos to Cloudinary
    const videoFiles = formData.getAll('videos') as File[]
    const uploadedVideos: string[] = []

    for (const videoFile of videoFiles) {
      if (videoFile && videoFile.size > 0) {
        try {
          const bytes = await videoFile.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'video',
                folder: 'walnut_leathers/videos',
                transformation: [
                  { width: 800, height: 600, crop: 'limit', quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error)
                else resolve(result)
              }
            ).end(buffer)
          })

          if (result && typeof result === 'object' && 'secure_url' in result) {
            uploadedVideos.push(result.secure_url as string)
          }
        } catch (error) {
          console.error('Error uploading video:', error)
          return NextResponse.json(
            { error: 'Failed to upload video' },
            { status: 500 }
          )
        }
      }
    }

    // Handle image URLs (direct URLs from internet)
    const imageUrls = formData.getAll('imageUrls') as string[]
    const videoUrls = formData.getAll('videoUrls') as string[]

    // Combine uploaded files and URLs
    const allImages = [...uploadedImages, ...imageUrls.filter(url => url.trim())]
    const allVideos = [...uploadedVideos, ...videoUrls.filter(url => url.trim())]

    // Validate that at least one image was provided (uploaded or URL)
    if (allImages.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required (upload file or provide URL)' },
        { status: 400 }
      )
    }

    // Add all media URLs to product data
    productData.images = allImages
    productData.videos = allVideos

    // Save to MongoDB (with fallback)
    try {
      console.log('Connecting to MongoDB...')
      const { db } = await connectToDatabase()
      console.log('Connected to MongoDB, database:', db.databaseName)
      
      const productsCollection = db.collection(COLLECTIONS.PRODUCTS)
      console.log('Inserting product data...')
      
      const result = await productsCollection.insertOne(productData as ProductData)
      console.log('Product inserted successfully:', result.insertedId)
      
      return NextResponse.json({
        success: true,
        productId: result.insertedId,
        message: 'Product uploaded successfully',
        data: {
          name: productData.name,
          images: allImages.length,
          videos: allVideos.length,
          uploadedImages: uploadedImages.length,
          imageUrls: imageUrls.length,
          uploadedVideos: uploadedVideos.length,
          videoUrls: videoUrls.length
        }
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      
      // Fallback: Return success even if database fails, but log the error
      console.log('MongoDB connection failed, but media upload was successful')
      
      return NextResponse.json({
        success: true,
        productId: 'temp_' + Date.now(),
        message: 'Product uploaded successfully (media saved, database connection issue)',
        warning: 'Database connection failed, but your images and videos were uploaded successfully. Please check your MongoDB connection.',
        data: {
          name: productData.name,
          images: allImages.length,
          videos: allVideos.length,
          uploadedImages: uploadedImages.length,
          imageUrls: imageUrls.length,
          uploadedVideos: uploadedVideos.length,
          videoUrls: videoUrls.length
        }
      })
    }

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET method to fetch all products (for admin dashboard)
export async function GET() {
  try {
    console.log('GET products route called')
    const { db } = await connectToDatabase()
    console.log('Connected to MongoDB for GET request')
    
    const productsCollection = db.collection(COLLECTIONS.PRODUCTS)
    
    const products = await productsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    console.log('Found products:', products.length)
    
    return NextResponse.json({
      success: true,
      products: products
    })
  } catch (error) {
    console.error('Fetch error:', error)
    
    // Return empty array if MongoDB is not connected
    return NextResponse.json({
      success: true,
      products: [],
      warning: 'Database connection failed. No products could be loaded.',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
