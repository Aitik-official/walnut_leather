import { NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const { db } = await connectToDatabase()
    
    // Check if admin already exists
    const existingAdmin = await db.collection(COLLECTIONS.USERS).findOne({ 
      email: 'admin@walnuttleather.com' 
    })
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists'
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = {
      name: 'Admin User',
      email: 'admin@walnuttleather.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(COLLECTIONS.USERS).insertOne(adminUser)

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      credentials: {
        email: 'admin@walnuttleather.com',
        password: 'admin123'
      }
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
