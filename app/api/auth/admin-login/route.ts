import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Check for admin user
    const adminUser = await db.collection(COLLECTIONS.USERS).findOne({ 
      email,
      role: 'admin'
    })

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: adminUser._id, 
        email: adminUser.email, 
        role: adminUser.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' } // Shorter expiry for admin
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      }
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
