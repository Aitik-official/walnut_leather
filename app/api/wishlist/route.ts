import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

// Helper function to get user ID from cookie
function getUserIdFromCookie(request: NextRequest): string | null {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return null
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    return decoded.userId
  } catch (error) {
    return null
  }
}

// GET all wishlist items for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromCookie(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { db } = await connectToDatabase()
    const wishlistCollection = db.collection(COLLECTIONS.WISHLIST)
    
    const items = await wishlistCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      items
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromCookie(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, productName, productPrice, productImage, productCategory } = body
    
    if (!productId || !productName || productPrice === undefined || !productImage) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const wishlistCollection = db.collection(COLLECTIONS.WISHLIST)
    
    // Check if item already exists in wishlist
    const existingItem = await wishlistCollection.findOne({
      userId,
      productId
    })
    
    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Item already in wishlist' },
        { status: 400 }
      )
    }
    
    const newItem = {
      userId,
      productId,
      productName,
      productPrice,
      productImage,
      productCategory: productCategory || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await wishlistCollection.insertOne(newItem)
    
    return NextResponse.json({
      success: true,
      item: {
        _id: result.insertedId.toString(),
        ...newItem
      }
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}

