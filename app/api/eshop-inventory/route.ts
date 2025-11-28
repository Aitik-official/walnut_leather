import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const inventoryCollection = db.collection('eshop_inventory')

    const inventory = await inventoryCollection
      .find({})
      .sort({ updateDate: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: inventory
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}

