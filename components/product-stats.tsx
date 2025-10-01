"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Package, TrendingUp } from "lucide-react"

export default function ProductStats() {
  const [databaseCount, setDatabaseCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductCount()
  }, [])

  const fetchProductCount = async () => {
    try {
      const response = await fetch('/api/products/upload')
      const data = await response.json()
      
      if (data.success) {
        setDatabaseCount(data.products?.length || 0)
      }
    } catch (error) {
      console.error('Error fetching product count:', error)
    } finally {
      setLoading(false)
    }
  }

  const staticCount = 8 // Number of static products

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Static Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{staticCount}</div>
          <p className="text-xs text-blue-700">Featured products</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            {loading ? '...' : databaseCount}
          </div>
          <p className="text-xs text-green-700">Uploaded products</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Total Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {loading ? '...' : staticCount + databaseCount}
          </div>
          <p className="text-xs text-purple-700">Combined inventory</p>
        </CardContent>
      </Card>
    </div>
  )
}
