import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT update sub category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, mainCategory, image } = body
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid sub category ID' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()
    const subCategoriesCollection = db.collection(COLLECTIONS.SUB_CATEGORIES)
    const mainCategoriesCollection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
    
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (name) {
      updateData.name = name
    }
    
    if (mainCategory) {
      // Validate main category exists
      const mainCategoryDoc = await mainCategoriesCollection.findOne({ 
        name: mainCategory 
      })
      
      if (!mainCategoryDoc) {
        return NextResponse.json(
          { success: false, error: 'Main category does not exist' },
          { status: 400 }
        )
      }
      updateData.mainCategory = mainCategory
    }
    
    if (image !== undefined) {
      updateData.image = image
    }
    
    const result = await subCategoriesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Sub category not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sub category updated successfully'
    })
  } catch (error) {
    console.error('Error updating sub category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update sub category' },
      { status: 500 }
    )
  }
}

// DELETE sub category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid sub category ID' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()
    const subCategoriesCollection = db.collection(COLLECTIONS.SUB_CATEGORIES)
    const productsCollection = db.collection(COLLECTIONS.PRODUCTS)
    
    // Check if sub category exists
    const subCategory = await subCategoriesCollection.findOne({ _id: new ObjectId(id) })
    if (!subCategory) {
      return NextResponse.json(
        { success: false, error: 'Sub category not found' },
        { status: 404 }
      )
    }
    
    // Check if there are products using this sub category
    const products = await productsCollection.countDocuments({ 
      subCategory: subCategory.name 
    })
    
    if (products > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete sub category with existing products' },
        { status: 400 }
      )
    }
    
    await subCategoriesCollection.deleteOne({ _id: new ObjectId(id) })
    
    return NextResponse.json({
      success: true,
      message: 'Sub category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting sub category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete sub category' },
      { status: 500 }
    )
  }
}

