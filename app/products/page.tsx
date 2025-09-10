export const revalidate = 0
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import ProductCard from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { productService } from "@/lib/product-service"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Package, ShoppingBag, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RefreshButton from "@/components/refresh-button"

export default async function ProductsPage() {
  const timestamp = Date.now()
  console.log(`[v0] ===== PRODUCTS PAGE ACCESSED =====`)
  console.log(`[v0] Loading products page with timestamp: ${timestamp}`)
  console.log(`[v0] Products page route: /products`)

  try {
    console.log(`[v0] Fetching products directly from Firestore...`)
    const snapshot = await getDocs(collection(db, "products"))
    const allProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
    console.log(`[v0] Products fetched successfully: ${allProducts.length} products`)
    console.log(
      `[v0] Products data:`,
      allProducts.map((p) => ({ id: p.id, name: p.name, category: p.category })),
    )

    const productsByCategory = allProducts.reduce(
      (acc, product) => {
        const category = product.category
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(product)
        return acc
      },
      {} as Record<string, typeof allProducts>,
    )

    console.log(
      `[v0] Products grouped by category:`,
      Object.keys(productsByCategory).map((cat) => `${cat}: ${productsByCategory[cat].length} products`),
    )

    const manufacturers = Array.from(new Set(allProducts.map((product) => product.category))).sort((a, b) =>
      a.localeCompare(b, "ar"),
    )

    console.log(`[v0] Manufacturers/Categories found:`, manufacturers)

    const categoryInfo = {
      "تصاميم وطنية": {
        description: "تصاميم تعبر عن الفخر والانتماء الوطني",
        color: "bg-green-500",
      },
      "تصاميم قوة ورياضة": {
        description: "تصاميم رياضية وكرة القدم",
        color: "bg-blue-500",
      },
      "تصاميم أنمي": {
        description: "تصاميم شخصيات الأنمي والمانجا المحبوبة",
        color: "bg-purple-500",
      },
      "تصاميم عصرية": {
        description: "تصاميم عصرية تواكب أحدث الصيحات",
        color: "bg-pink-500",
      },
      "تصاميم المناسبات": {
        description: "تصاميم خاصة بالمناسبات والأعياد",
        color: "bg-yellow-500",
      },
      "تصاميم أفلام ومسلسلات": {
        description: "تصاميم مستوحاة من الأفلام والمسلسلات",
        color: "bg-red-500",
      },
      "تصاميم مخصصة": {
        description: "تصاميم مخصصة حسب طلبك",
        color: "bg-indigo-500",
      },
    }

    return (
      <div className="min-h-screen">
        <div className="fixed top-16 left-4 z-50 bg-black text-white p-2 text-xs rounded">
          Products Page Loaded: {allProducts.length} items
        </div>

        <div className="fixed top-4 left-4 z-50">
          <RefreshButton />
        </div>

        {/* Page Header */}
        <section className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
                <h1 className="text-3xl lg:text-4xl font-bold">جميع المنتجات</h1>
              </div>
              <p className="text-muted-foreground mb-6">
                اكتشف مجموعتنا الكاملة من التصاميم المميزة والمنتجات عالية الجودة
              </p>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {allProducts.length} منتج متاح
              </Badge>
            </div>
          </div>
        </section>

        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">تصفية المنتجات</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Select>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التصنيفات</SelectItem>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث</SelectItem>
                    <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
                    <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
                    <SelectItem value="name">الاسم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products by Category */}
        <section className="py-12">
          <div className="container mx-auto px-4 space-y-16">
            {Object.entries(productsByCategory).length > 0 ? (
              Object.entries(productsByCategory).map(([category, products]) => (
                <div key={category} className="space-y-8">
                  {/* Category Header */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl flex items-center gap-3">
                            <Package className="w-6 h-6 text-primary" />
                            {category}
                          </CardTitle>
                          <p className="text-muted-foreground mt-2">
                            {categoryInfo[category as keyof typeof categoryInfo]?.description || "تصاميم مميزة ومتنوعة"}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${categoryInfo[category as keyof typeof categoryInfo]?.color || "bg-primary"} text-white`}
                        >
                          {products.length} منتج
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Products Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-2xl font-semibold mb-4">لا توجد منتجات متاحة حالياً</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  نعمل على إضافة منتجات جديدة ومميزة. تابعنا للحصول على أحدث التصاميم والعروض
                </p>
                <Button asChild>
                  <a href="/">العودة للرئيسية</a>
                </Button>
              </div>
            )}

            {/* Removed predefined empty sections; show only Firestore-backed categories */}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error(`[v0] ERROR in products page:`, error)
    console.error(`[v0] Error stack:`, error instanceof Error ? error.stack : "No stack trace")

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في تحميل صفحة المنتجات</h1>
          <p className="text-muted-foreground mb-4">حدث خطأ أثناء تحميل المنتجات</p>
          <Button asChild>
            <a href="/">العودة للرئيسية</a>
          </Button>
        </div>
      </div>
    )
  }
}
