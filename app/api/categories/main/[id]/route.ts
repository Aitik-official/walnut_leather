import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT update main category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, image } = body
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()
    const categoriesCollection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
    
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (name) {
      const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      if (!['Mens', 'Womens'].includes(normalizedName)) {
        return NextResponse.json(
          { success: false, error: 'Main category must be either "Mens" or "Womens"' },
          { status: 400 }
        )
      }
      updateData.name = normalizedName
    }
    
    if (image !== undefined) {
      updateData.image = image
    }
    
    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category updated successfully'
    })
  } catch (error) {
    console.error('Error updating main category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE main category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()
    const categoriesCollection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
    const subCategoriesCollection = db.collection(COLLECTIONS.SUB_CATEGORIES)
    
    // Check if category exists
    const category = await categoriesCollection.findOne({ _id: new ObjectId(id) })
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    // Check if there are sub-categories using this main category
    const subCategories = await subCategoriesCollection.countDocuments({ 
      mainCategory: category.name 
    })
    
    if (subCategories > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with existing sub-categories' },
        { status: 400 }
      )
    }
    
    await categoriesCollection.deleteOne({ _id: new ObjectId(id) })
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting main category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

