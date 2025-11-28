import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all sub categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mainCategory = searchParams.get('mainCategory')
    
    const { db } = await connectToDatabase()
    const subCategoriesCollection = db.collection(COLLECTIONS.SUB_CATEGORIES)
    
    const query: any = {}
    if (mainCategory) {
      query.mainCategory = mainCategory
    }
    
    const subCategories = await subCategoriesCollection
      .find(query)
      .sort({ name: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      subCategories
    })
  } catch (error) {
    console.error('Error fetching sub categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sub categories' },
      { status: 500 }
    )
  }
}

// POST create new sub category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, mainCategory, image } = body
    
    if (!name || !mainCategory) {
      return NextResponse.json(
        { success: false, error: 'Sub category name and main category are required' },
        { status: 400 }
      )
    }
    
    // Validate main category exists
    const { db } = await connectToDatabase()
    const mainCategoriesCollection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
    const subCategoriesCollection = db.collection(COLLECTIONS.SUB_CATEGORIES)
    
    const mainCategoryDoc = await mainCategoriesCollection.findOne({ 
      name: mainCategory 
    })
    
    if (!mainCategoryDoc) {
      return NextResponse.json(
        { success: false, error: 'Main category does not exist' },
        { status: 400 }
      )
    }
    
    // Check if sub category already exists for this main category
    const existingSubCategory = await subCategoriesCollection.findOne({ 
      name: name,
      mainCategory: mainCategory
    })
    
    if (existingSubCategory) {
      return NextResponse.json(
        { success: false, error: 'Sub category already exists for this main category' },
        { status: 400 }
      )
    }
    
    const newSubCategory = {
      name: name,
      mainCategory: mainCategory,
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await subCategoriesCollection.insertOne(newSubCategory)
    
    return NextResponse.json({
      success: true,
      subCategory: {
        _id: result.insertedId.toString(),
        ...newSubCategory
      }
    })
  } catch (error) {
    console.error('Error creating sub category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create sub category' },
      { status: 500 }
    )
  }
}

