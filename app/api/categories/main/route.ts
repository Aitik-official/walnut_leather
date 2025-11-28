import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all main categories
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const categoriesCollection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
    
    const categories = await categoriesCollection
      .find({})
      .sort({ name: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      categories
    })
  } catch (error) {
    console.error('Error fetching main categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST create new main category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, image } = body
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    // Validate name is either "Mens" or "Womens"
    const validNames = ['Mens', 'Womens', 'mens', 'womens']
    const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    
    if (!['Mens', 'Womens'].includes(normalizedName)) {
      return NextResponse.json(
        { success: false, error: 'Main category must be either "Mens" or "Womens"' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()
    const categoriesCollection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
    
    // Check if category already exists
    const existingCategory = await categoriesCollection.findOne({ 
      name: normalizedName 
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 400 }
      )
    }
    
    const newCategory = {
      name: normalizedName,
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await categoriesCollection.insertOne(newCategory)
    
    return NextResponse.json({
      success: true,
      category: {
        _id: result.insertedId.toString(),
        ...newCategory
      }
    })
  } catch (error) {
    console.error('Error creating main category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

