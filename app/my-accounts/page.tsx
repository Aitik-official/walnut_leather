"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, ShoppingCart, RefreshCw, Eye, ArrowLeft, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Order {
  _id: string
  orderNo?: string
  orderId?: string
  orderDate?: string | Date
  createdAt?: string | Date
  totalAmount?: number
  totals?: {
    total: number
  }
  status: string
  items: Array<{
    productName?: string
    itemName?: string
    name?: string
    quantity: number
    price: number
  }>
  customerName?: string
  customer?: {
    firstName?: string
    lastName?: string
    email?: string
  }
  shippingAddress?: {
    street?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    receiverName?: string
  }
  shipping?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
  }
  notes?: string
  userEmail?: string
  customerEmail?: string
}


export default function MyAccountsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<string>("profile")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("")
  const [userData, setUserData] = useState<any>(null)
  
  // Dialog states
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)

  // Fetch all data
  const fetchSubmissions = async () => {
    try {
      // Get user from localStorage
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        router.push("/")
        return
      }

      const userDataObj = JSON.parse(userStr)
      const email = userDataObj.email
      setUserEmail(email)
      setUserData(userDataObj)

      // Fetch orders
      const ordersRes = await fetch('/api/orders')

      // Process orders
      const ordersData = await ordersRes.json()
      if (ordersData.success) {
        const ordersList = ordersData.orders || ordersData.data || []
        const filteredOrders = ordersList.filter((order: Order) => {
          // Match by email from customer object or order fields
          const orderEmail = order.customer?.email?.toLowerCase() || 
                            order.userEmail?.toLowerCase() || 
                            order.customerEmail?.toLowerCase()
          return orderEmail === email.toLowerCase()
        })
        
        // Transform orders to match expected format
        const transformedOrders = filteredOrders.map((order: any) => ({
          ...order,
          orderNo: order.orderNo || order.orderId,
          totalAmount: order.totalAmount || order.totals?.total || 0,
          customerName: order.customer?.firstName && order.customer?.lastName 
            ? `${order.customer.firstName} ${order.customer.lastName}`
            : order.customerName,
          shippingAddress: order.shipping || order.shippingAddress,
          items: order.items || []
        }))
        setOrders(transformedOrders)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSubmissions()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    router.push("/")
    router.refresh()
  }

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order)
    setIsOrderDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === "pending") return "bg-secondary/20 text-secondary"
    if (["confirmed", "viewed"].includes(statusLower)) return "bg-secondary/30 text-secondary"
    if (statusLower === "shipped") return "bg-primary/20 text-primary"
    if (["delivered", "order placed"].includes(statusLower)) return "bg-secondary/30 text-secondary"
    if (["cancelled", "rejected", "closed"].includes(statusLower)) return "bg-destructive/20 text-destructive"
    return "bg-muted text-muted-foreground"
  }

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString()
  }

  const formatDateTime = (date: string | Date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingCart }
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">My Account</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="text-secondary border-secondary hover:bg-secondary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setRefreshing(true)
                fetchSubmissions()
              }}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Profile Section */}
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your profile information</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={userData?.name || "N/A"} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={userEmail || "N/A"} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={userData?.phone || "N/A"} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input 
                      value={
                        [userData?.address, userData?.city, userData?.state]
                          .filter(Boolean)
                          .join(" ") || "N/A"
                      } 
                      readOnly 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <p className="text-sm text-muted-foreground">View and track your orders</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No orders found</p>
                    <p className="text-sm">Orders will appear here when your quotations are accepted by admin</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order No.</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">{order.orderNo || order.orderId || "N/A"}</TableCell>
                          <TableCell>{formatDate(order.orderDate || order.createdAt)}</TableCell>
                          <TableCell>
                            ₹{(order.totalAmount || order.totals?.total || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.items?.length || 0} items</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {viewingOrder?.orderNo || viewingOrder?.orderId || "N/A"}</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Date</Label>
                  <p className="text-sm">{formatDateTime(viewingOrder.orderDate || viewingOrder.createdAt)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(viewingOrder.status)}>
                    {viewingOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <p className="text-sm font-semibold">
                    ₹{(viewingOrder.totalAmount || viewingOrder.totals?.total || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>Customer Name</Label>
                  <p className="text-sm">
                    {viewingOrder.customerName || 
                     (viewingOrder.customer?.firstName && viewingOrder.customer?.lastName 
                       ? `${viewingOrder.customer.firstName} ${viewingOrder.customer.lastName}`
                       : null) ||
                     viewingOrder.shippingAddress?.receiverName || 
                     "N/A"}
                  </p>
                </div>
              </div>
              
              <div>
                <Label>Items</Label>
                <div className="mt-2 space-y-2">
                  {viewingOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-muted rounded">
                      <span className="text-sm">
                        {item.productName || item.itemName || item.name} × {item.quantity}
                      </span>
                      <span className="text-sm font-medium">
                        ₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {(viewingOrder.shippingAddress || viewingOrder.shipping) && (
                <div>
                  <Label>Shipping Address</Label>
                  <p className="text-sm">
                    {[
                      viewingOrder.shippingAddress?.street || viewingOrder.shippingAddress?.address || viewingOrder.shipping?.address,
                      viewingOrder.shippingAddress?.city || viewingOrder.shipping?.city,
                      viewingOrder.shippingAddress?.state || viewingOrder.shipping?.state,
                      viewingOrder.shippingAddress?.zipCode || viewingOrder.shipping?.zipCode
                    ].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}

              {viewingOrder.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm">{viewingOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

