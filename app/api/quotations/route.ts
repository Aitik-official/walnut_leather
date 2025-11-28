import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    const { db } = await connectToDatabase()
    const quotationsCollection = db.collection('quotations')

    const query: any = {}
    if (email) {
      query.userEmail = email.toLowerCase()
    }

    const quotations = await quotationsCollection
      .find(query)
      .sort({ quotationDate: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: quotations
    })
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}

