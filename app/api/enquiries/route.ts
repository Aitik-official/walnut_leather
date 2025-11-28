import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    const { db } = await connectToDatabase()
    const enquiriesCollection = db.collection('enquiries')

    const query: any = {}
    if (email) {
      query.userEmail = email.toLowerCase()
    }

    const enquiries = await enquiriesCollection
      .find(query)
      .sort({ enquiryDate: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: enquiries
    })
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}

