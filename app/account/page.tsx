"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Calendar, Package, LogOut } from "lucide-react"

export default function AccountPage() {
  const { state, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push("/")
    }
  }, [state.isAuthenticated, state.isLoading, router])

  if (state.isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>جاري التحميل...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!state.user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">حسابي</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* User Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{state.user.name}</p>
                    <p className="text-sm text-muted-foreground">الاسم</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{state.user.email}</p>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  </div>
                </div>

                {state.user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{state.user.phone}</p>
                      <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{new Date(state.user.createdAt).toLocaleDateString("ar-SA")}</p>
                    <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                  </div>
                </div>

                <Separator />

                <Button variant="outline" className="w-full bg-transparent">
                  تعديل المعلومات
                </Button>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  طلباتي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">لا توجد طلبات بعد</h3>
                  <p className="text-muted-foreground mb-4">ابدأ التسوق واطلب تيشيرتك المفضل</p>
                  <Button onClick={() => router.push("/")}>تصفح المنتجات</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                  <Package className="w-6 h-6" />
                  <span>تتبع الطلبات</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                  <User className="w-6 h-6" />
                  <span>تعديل الملف الشخصي</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                  <Mail className="w-6 h-6" />
                  <span>تواصل معنا</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
