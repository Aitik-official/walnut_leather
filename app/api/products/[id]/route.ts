import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/cloudinary'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const productsCollection = db.collection(COLLECTIONS.PRODUCTS)

    const product = await productsCollection.findOne({ _id: new ObjectId(id) })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    
    // Extract form data
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const mainCategory = formData.get('mainCategory') as string || undefined
    const subCategory = formData.get('subCategory') as string || undefined
    const availableSizes = JSON.parse(formData.get('availableSizes') as string || '[]')
    const color = formData.get('color') as string || ''
    const material = formData.get('material') as string || ''
    const stock = parseInt(formData.get('stock') as string || '0')
    const featured = formData.get('featured') === 'true'
    const featuredNickname = formData.get('featuredNickname') as string || undefined

    // Validate required fields
    if (!name || !description || !price || !mainCategory || !subCategory) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, mainCategory, and subCategory are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const productsCollection = db.collection(COLLECTIONS.PRODUCTS)

    // Check if product exists
    const existingProduct = await productsCollection.findOne({ _id: new ObjectId(id) })
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      name,
      description,
      price,
      category,
      mainCategory,
      subCategory,
      availableSizes,
      color,
      material,
      stock,
      featured,
      featuredNickname,
      exclusive: formData.get('exclusive') === 'true',
      limitedTimeDeal: formData.get('limitedTimeDeal') === 'true',
      updatedAt: new Date()
    }

    // Handle media management
    const existingImages = formData.getAll('existingImages') as string[]
    const existingVideos = formData.getAll('existingVideos') as string[]
    const removedImages = formData.getAll('removedImages') as string[]
    const removedVideos = formData.getAll('removedVideos') as string[]
    const newImages = formData.getAll('images') as File[]
    const newVideos = formData.getAll('videos') as File[]
    const newImageUrls = formData.getAll('imageUrls') as string[]
    const newVideoUrls = formData.getAll('videoUrls') as string[]

    // Upload new files to Cloudinary if any
    let uploadedNewImages: string[] = []
    let uploadedNewVideos: string[] = []

    // Upload new images
    for (const imageFile of newImages) {
      if (imageFile && imageFile.size > 0) {
        try {
          const bytes = await imageFile.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          const result = await uploadImageToCloudinary(imageFile, 'products')
          uploadedNewImages.push(result.secure_url)
        } catch (error) {
          console.error('Error uploading new image:', error)
        }
      }
    }

    // Upload new videos
    for (const videoFile of newVideos) {
      if (videoFile && videoFile.size > 0) {
        try {
          const result = await uploadImageToCloudinary(videoFile, 'products', 'video')
          uploadedNewVideos.push(result.secure_url)
        } catch (error) {
          console.error('Error uploading new video:', error)
        }
      }
    }

    // Build final images array: existing (not removed) + uploaded new files + new URLs
    const finalImages = [
      ...existingImages,
      ...uploadedNewImages,
      ...newImageUrls.filter(url => url.trim())
    ]
    updateData.images = finalImages

    // Build final videos array: existing (not removed) + uploaded new files + new URLs
    const finalVideos = [
      ...existingVideos,
      ...uploadedNewVideos,
      ...newVideoUrls.filter(url => url.trim())
    ]
    updateData.videos = finalVideos

    // Update the product
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const productsCollection = db.collection(COLLECTIONS.PRODUCTS)

    // Check if product exists
    const existingProduct = await productsCollection.findOne({ _id: new ObjectId(id) })
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete the product
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}