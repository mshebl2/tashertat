"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthService, type User } from "@/lib/auth"
import { OrderService } from "@/lib/orders"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import AdminPasswordGuard from "@/components/admin-password-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserIcon, Mail, Phone, Calendar, ShoppingCart, Search } from "lucide-react"

export default function AdminCustomers() {
  const { state } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [customerOrders, setCustomerOrders] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!state.isLoading && (!state.isAuthenticated || !AuthService.isAdmin(state.user))) {
      router.push("/")
      return
    }

    loadCustomers()
  }, [state, router])

  const loadCustomers = () => {
    const allUsers = AuthService.getUsers()
    const customerUsers = allUsers.filter((user) => user.role === "customer")
    setCustomers(customerUsers)

    // Count orders for each customer
    const orders = OrderService.getOrders()
    const orderCounts: Record<string, number> = {}

    customerUsers.forEach((customer) => {
      orderCounts[customer.id] = orders.filter((order) => order.customerId === customer.id).length
    })

    setCustomerOrders(orderCounts)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm)),
  )

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
            <h2 className="text-3xl font-bold">إدارة العملاء</h2>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {customers.length} عميل
            </Badge>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن عميل (الاسم، البريد، الهاتف)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customers List */}
          <div className="space-y-4">
            {filteredCustomers.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <UserIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "لم يتم العثور على عملاء مطابقين للبحث" : "لا يوجد عملاء مسجلين بعد"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{customer.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              عضو منذ {new Date(customer.createdAt).toLocaleDateString("ar-SA")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{customerOrders[customer.id] || 0} طلب</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{customer.email}</p>
                            <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                          </div>
                        </div>

                        {customer.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{customer.phone}</p>
                              <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(customer.createdAt).toLocaleDateString("ar-SA")}
                            </p>
                            <p className="text-xs text-muted-foreground">تاريخ التسجيل</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <ShoppingCart className="w-4 h-4 ml-2" />
                          عرض الطلبات ({customerOrders[customer.id] || 0})
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 ml-2" />
                          إرسال رسالة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminPasswordGuard>
  )
}
