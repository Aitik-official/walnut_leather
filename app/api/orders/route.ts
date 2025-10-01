import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Customer {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface Shipping {
  address: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Payment {
  method: string
  last4: string
}

interface Totals {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

interface Order {
  orderId: string
  items: OrderItem[]
  customer: Customer
  shipping: Shipping
  payment: Payment
  totals: Totals
  notes?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export async function POST(request: NextRequest) {
  try {
    const orderData: Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'> = await request.json()
    
    // Generate order ID
    const orderId = `WL${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    // Create order object
    const order: Order = {
      orderId,
      ...orderData,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Save to MongoDB
    const { db } = await connectToDatabase()
    const ordersCollection = db.collection(COLLECTIONS.ORDERS)
    
    const result = await ordersCollection.insertOne(order)
    
    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: 'Order placed successfully',
      data: {
        orderId: orderId,
        total: order.totals.total,
        status: order.status,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
  } catch (error) {
    console.error('Order placement error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to place order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET method to fetch orders (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()
    const ordersCollection = db.collection(COLLECTIONS.ORDERS)

    // Build query
    const query: any = {}
    if (status) {
      query.status = status
    }

    // Get orders with pagination
    const orders = await ordersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const totalCount = await ordersCollection.countDocuments(query)
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
