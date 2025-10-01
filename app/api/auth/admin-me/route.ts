import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ success: false, user: null })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, user: null })
    }

    const { db } = await connectToDatabase()
    
    const user = await db.collection(COLLECTIONS.USERS).findOne({
      _id: new ObjectId(decoded.userId),
      role: 'admin'
    })

    if (!user) {
      return NextResponse.json({ success: false, user: null })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error) {
    console.error('Admin auth check error:', error)
    return NextResponse.json({ success: false, user: null })
  }
}
