"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthService } from "@/lib/auth"
import { OrderService } from "@/lib/orders"
import { productService } from "@/lib/product-service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import AdminPasswordGuard from "@/components/admin-password-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Counter } from "@/components/counter"

export default function AdminDashboard() {
  const { state } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenue: 0,
    newOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  })

  useEffect(() => {
    // Initialize default admin
    AuthService.initializeDefaultAdmin()

    if (!state.isLoading && (!state.isAuthenticated || !AuthService.isAdmin(state.user))) {
      router.push("/")
      return
    }

    // Calculate stats
    const orders = OrderService.getOrders()
    const users = AuthService.getUsers()
    const customers = users.filter((user) => user.role === "customer")
    const allProducts = productService.getAllProducts()

    setStats({
      totalProducts: allProducts.length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      newOrders: orders.filter((order) => order.status === "جديد").length,
      processingOrders: orders.filter((order) => order.status === "قيد التنفيذ").length,
      completedOrders: orders.filter((order) => order.status === "مكتمل").length,
      cancelledOrders: orders.filter((order) => order.status === "ملغي").length,
    })
  }, [state, router])

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
          <div>
            <h2 className="text-3xl font-bold mb-2">مرحباً، {state.user?.name}</h2>
            <p className="text-muted-foreground">إليك نظرة عامة على أداء المتجر</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Counter end={stats.totalProducts} />
                </div>
                <p className="text-xs text-muted-foreground">منتج متاح</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Counter end={stats.totalOrders} />
                </div>
                <p className="text-xs text-muted-foreground">طلب إجمالي</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">العملاء</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Counter end={stats.totalCustomers} />
                </div>
                <p className="text-xs text-muted-foreground">عميل مسجل</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Counter end={stats.revenue} suffix=" ر.س" />
                </div>
                <p className="text-xs text-muted-foreground">إجمالي المبيعات</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">طلبات جديدة</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  <Counter end={stats.newOrders} />
                </div>
                <Badge variant="secondary" className="mt-1">
                  جديد
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  <Counter end={stats.processingOrders} />
                </div>
                <Badge variant="outline" className="mt-1">
                  قيد التنفيذ
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  <Counter end={stats.completedOrders} />
                </div>
                <Badge variant="default" className="mt-1 bg-green-600">
                  مكتمل
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ملغية</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  <Counter end={stats.cancelledOrders} />
                </div>
                <Badge variant="destructive" className="mt-1">
                  ملغي
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/admin/products")}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">إضافة منتج جديد</h3>
                      <p className="text-sm text-muted-foreground">أضف منتجات جديدة للمتجر</p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/admin/orders")}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">مراجعة الطلبات</h3>
                      <p className="text-sm text-muted-foreground">تحديث حالة الطلبات</p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/admin/customers")}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">إدارة العملاء</h3>
                      <p className="text-sm text-muted-foreground">عرض بيانات العملاء</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminPasswordGuard>
  )
}
