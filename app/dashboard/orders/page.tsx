"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart, Eye, Search, Filter, Calendar, User, Package, Truck, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminAuthModal from "@/components/admin-auth-modal"

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
  _id: string
  orderId: string
  items: OrderItem[]
  customer: Customer
  shipping: Shipping
  payment: Payment
  totals: Totals
  notes?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface OrdersResponse {
  success: boolean
  orders: Order[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/auth/admin-me')
      const data = await response.json()
      
      if (data.success && data.user) {
        setIsAuthenticated(true)
        fetchOrders()
      } else {
        setShowAuthModal(true)
      }
    } catch (error) {
      setShowAuthModal(true)
    }
  }

  const fetchOrders = async (status?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      params.append('limit', '50') // Get more orders for admin view
      
      const response = await fetch(`/api/orders?${params.toString()}`)
      const data: OrdersResponse = await response.json()
      
      if (data.success) {
        setOrders(data.orders || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    fetchOrders(status === 'all' ? undefined : status)
  }

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      order.orderId.toLowerCase().includes(searchLower) ||
      order.customer.email.toLowerCase().includes(searchLower) ||
      order.customer.firstName.toLowerCase().includes(searchLower) ||
      order.customer.lastName.toLowerCase().includes(searchLower) ||
      order.items.some(item => item.name.toLowerCase().includes(searchLower))
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Package className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <Package className="h-4 w-4" />
      case 'cancelled': return <Package className="h-4 w-4" />
      case 'pending': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  if (!isAuthenticated) {
    return (
      <AdminAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsAuthenticated(true)
          fetchOrders()
        }}
      />
    )
  }

  return (
    <div className="w-full h-full">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="features-gradient">Orders</span>
            </h1>
            <p className="text-muted-foreground">Manage customer orders and track fulfillment</p>
          </div>
          <Button 
            onClick={() => fetchOrders()}
            variant="outline"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Refresh Orders
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'confirmed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'shipped').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${orders.reduce((sum, order) => sum + order.totals.total, 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Filters and Search */}
        <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search orders</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by order ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Orders Table */}
        <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Manage and track all customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter 
                    ? "No orders match your search criteria" 
                    : "No orders have been placed yet"
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ORDER</TableHead>
                    <TableHead>CUSTOMER</TableHead>
                    <TableHead>ITEMS</TableHead>
                    <TableHead>TOTAL</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">#{order.orderId}</p>
                          <p className="text-xs text-muted-foreground">ID: {order._id.slice(-8)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} total qty
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${order.totals.total.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - #{order.orderId}</DialogTitle>
                              <DialogDescription>
                                Complete order information and customer details
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Order Status & Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Order Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order ID:</span>
                                        <span className="font-mono">#{selectedOrder.orderId}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge className={getStatusColor(selectedOrder.status)}>
                                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order Date:</span>
                                        <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Updated:</span>
                                        <span>{new Date(selectedOrder.updatedAt).toLocaleDateString()}</span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Payment Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Method:</span>
                                        <span>{selectedOrder.payment.method.toUpperCase()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Card:</span>
                                        <span>**** {selectedOrder.payment.last4}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span>${selectedOrder.totals.subtotal.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax:</span>
                                        <span>${selectedOrder.totals.tax.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping:</span>
                                        <span>${selectedOrder.totals.shipping.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between font-semibold text-lg">
                                        <span>Total:</span>
                                        <span>${selectedOrder.totals.total.toFixed(2)}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Customer Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <User className="h-5 w-5" />
                                      Customer Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Billing Details</h4>
                                        <div className="space-y-1 text-sm">
                                          <p><strong>Name:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                          <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                                          <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium mb-2">Shipping Address</h4>
                                        <div className="space-y-1 text-sm">
                                          <p>{selectedOrder.shipping.address}</p>
                                          {selectedOrder.shipping.apartment && <p>{selectedOrder.shipping.apartment}</p>}
                                          <p>{selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zipCode}</p>
                                          <p>{selectedOrder.shipping.country}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Order Items */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <Package className="h-5 w-5" />
                                      Order Items
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                          <div className="relative w-16 h-16 flex-shrink-0">
                                            <img
                                              src={item.image}
                                              alt={item.name}
                                              className="w-full h-full object-cover rounded"
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground">Product ID: {item.productId}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-medium">${item.price.toFixed(2)}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Order Notes */}
                                {selectedOrder.notes && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Order Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-sm">{selectedOrder.notes}</p>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
