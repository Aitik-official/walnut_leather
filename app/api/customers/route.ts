import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const customersCollection = db.collection(COLLECTIONS.USERS)

    const customers = await customersCollection
      .find({})
      .toArray()

    return NextResponse.json({
      success: true,
      data: customers
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}

