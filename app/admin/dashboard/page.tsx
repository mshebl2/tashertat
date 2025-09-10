"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, LogOut, Plus, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export type MenuItem = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // TODO: implement Firebase Auth if needed
    setUser({ id: "admin" })
    fetchMenuItems()
    setLoading(false)
  }, [])

  const fetchMenuItems = async () => {
    try {
      const menuRef = collection(db, "menu")
      const querySnapshot = await getDocs(menuRef)
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as MenuItem[]
      setMenuItems(items)
    } catch (err) {
      setError("فشل تحميل قائمة الطعام")
      console.error("Error fetching menu items:", err)
    }
  }

  const handleLogout = async () => {
    // TODO: implement logout
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم الإدارية</h1>
            <p className="text-muted-foreground">مرحباً، {user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي العناصر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط السعر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {menuItems.length > 0
                  ? `${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)} ر.س`
                  : "0 ر.س"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أعلى سعر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {menuItems.length > 0 ? `${Math.max(...menuItems.map((item) => item.price))} ر.س` : "0 ر.س"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>عناصر القائمة</CardTitle>
                <CardDescription>إدارة عناصر القائمة والمنتجات</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                إضافة عنصر جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {menuItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">لا توجد عناصر في القائمة</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={item.image_url || "/placeholder.svg?height=200&width=200&query=menu+item"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{item.price} ر.س</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
