import { MongoClient, Db } from 'mongodb'

// Global type declaration for mongo cache
declare global {
  var mongo: {
    conn: { client: MongoClient; db: Db } | null
    promise: Promise<{ client: MongoClient; db: Db }> | null
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const MONGODB_DB = process.env.MONGODB_DB || 'leather_website'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      // Remove deprecated bufferMaxEntries option
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      }
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Product Schema Interface
export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  category: 'jackets' | 'bags' | 'wallets' | 'belts' | 'accessories'
  size?: string
  color?: string
  material?: string
  stock: number
  featured: boolean
  images: string[]
  videos: string[]
  createdAt: Date
  updatedAt: Date
}

// Database Collections
export const COLLECTIONS = {
  PRODUCTS: 'products',
  USERS: 'users',
  ORDERS: 'orders',
  CATEGORIES: 'categories'
} as const
