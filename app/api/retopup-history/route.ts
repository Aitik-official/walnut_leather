import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    const { db } = await connectToDatabase()
    const retopupCollection = db.collection('retopup_history')

    const query: any = {}
    if (customerId) {
      query.customerId = customerId
    }

    const history = await retopupCollection
      .find(query)
      .sort({ updateDate: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: history
    })
  } catch (error) {
    console.error('Error fetching retopup history:', error)
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}

