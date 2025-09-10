"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthService } from "@/lib/auth"
import { OrderService, type Order } from "@/lib/orders"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import AdminPasswordGuard from "@/components/admin-password-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Download, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function AdminOrders() {
  const { state } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "all">("all")

  useEffect(() => {
    if (!state.isLoading && (!state.isAuthenticated || !AuthService.isAdmin(state.user))) {
      router.push("/")
      return
    }

    loadOrders()
  }, [state, router])

  const loadOrders = () => {
    const allOrders = OrderService.getOrders()
    setOrders(allOrders)
  }

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    OrderService.updateOrderStatus(orderId, newStatus)
    loadOrders()
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "جديد":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "قيد التنفيذ":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "مكتمل":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "ملغي":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "جديد":
        return <Badge variant="secondary">{status}</Badge>
      case "قيد التنفيذ":
        return <Badge variant="outline">{status}</Badge>
      case "مكتمل":
        return <Badge className="bg-green-600">{status}</Badge>
      case "ملغي":
        return <Badge variant="destructive">{status}</Badge>
    }
  }

  const filteredOrders = selectedStatus === "all" ? orders : orders.filter((order) => order.status === selectedStatus)

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!state.isAuthenticated || !AuthService.isAdmin(state.user)) {
    return null
  }

  return (
    <AdminPasswordGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">إدارة الطلبات</h2>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as Order["status"] | "all")}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="جديد">جديد</SelectItem>
                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="ملغي">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Order["status"] | "all")}>
            <TabsList>
              <TabsTrigger value="all">الكل ({orders.length})</TabsTrigger>
              <TabsTrigger value="جديد">جديد ({orders.filter((o) => o.status === "جديد").length})</TabsTrigger>
              <TabsTrigger value="قيد التنفيذ">
                قيد التنفيذ ({orders.filter((o) => o.status === "قيد التنفيذ").length})
              </TabsTrigger>
              <TabsTrigger value="مكتمل">مكتمل ({orders.filter((o) => o.status === "مكتمل").length})</TabsTrigger>
              <TabsTrigger value="ملغي">ملغي ({orders.filter((o) => o.status === "ملغي").length})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedStatus} className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                      <p className="text-muted-foreground">لا توجد طلبات في هذه الفئة حالياً</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <CardTitle className="text-lg">طلب #{order.id}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {order.customerName} - {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            <span className="font-bold text-primary">{order.total} ر.س</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-semibold mb-2">المنتجات ({order.items.length})</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 bg-secondary/20 rounded-lg">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.size} - {item.color} - {item.printType} - الكمية: {item.quantity}
                                    </p>
                                    {item.uploadedFile && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <Download className="w-3 h-3 text-green-600" />
                                        <span className="text-xs text-green-600">
                                          ملف مرفق: {item.uploadedFile.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <span className="font-bold text-sm">{item.price * item.quantity} ر.س</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div>
                            <h4 className="font-semibold mb-2">معلومات العميل</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">الاسم: </span>
                                <span>{order.customerName}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">البريد: </span>
                                <span>{order.customerEmail}</span>
                              </div>
                              {order.customerPhone && (
                                <div>
                                  <span className="text-muted-foreground">الهاتف: </span>
                                  <span>{order.customerPhone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusUpdate(order.id, value as Order["status"])}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="جديد">جديد</SelectItem>
                                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                                <SelectItem value="مكتمل">مكتمل</SelectItem>
                                <SelectItem value="ملغي">ملغي</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 ml-2" />
                              عرض التفاصيل
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminPasswordGuard>
  )
}
