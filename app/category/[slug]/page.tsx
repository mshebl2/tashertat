import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Grid, List } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import Link from "next/link"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

const normalizeString = (str: string): string => {
  return str.trim().toLowerCase().replace(/\s+/g, " ")
}

async function getCategoryBySlug(slug: string) {
  try {
    const decodedSlug = decodeURIComponent(slug)
    console.log("[v0] Original slug:", slug)
    console.log("[v0] Decoded slug:", decodedSlug)

    const categoriesRef = collection(db, "categories")
    const q = query(categoriesRef, where("slug", "==", decodedSlug))
    const querySnapshot = await getDocs(q)

    const categories = querySnapshot.docs.map(doc => doc.data())

    if (categories.length === 0) {
      console.log("[v0] No category found by slug, trying by name...")

      const nameQuery = query(categoriesRef, where("name", "==", decodedSlug))
      const nameSnapshot = await getDocs(nameQuery)
      return nameSnapshot.docs.map(doc => doc.data())
    }

    return categories
  } catch (error) {
    console.error("[v0] Error fetching category by slug:", error)
    return []
  }
}

async function getProductsByCategory(categoryName: string) {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("category", "==", categoryName))
    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log("[v0] Products found for category:", categoryName, "Count:", products.length)
    return products
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {

  const categories = await getCategoryBySlug(params.slug)
  const category = Array.isArray(categories) && categories.length > 0 ? categories[0] : null;

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">القسم غير موجود</h1>
          <p className="text-muted-foreground mb-6">لم نتمكن من العثور على هذا القسم</p>
          <Button asChild>
            <Link href="/">العودة للرئيسية</Link>
          </Button>
        </div>
      </div>
    )
  }

  const products = await getProductsByCategory(category.name)

  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <section className="bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{category.name}</h1>
            {category.description ? (
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{category.description}</p>
            ) : (
              <p className="text-muted-foreground mb-6">تصفح مجموعة {category.name} المميزة</p>
            )}
            <Badge variant="outline" className="text-lg px-4 py-2">
              {products.length} منتج متاح
            </Badge>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 ml-2" />
                فلترة
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <select className="px-4 py-2 border border-border rounded-md bg-background">
              <option value="newest">الأحدث</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-4">لا توجد منتجات في هذا القسم حالياً</h3>
              <p className="text-muted-foreground mb-6">نعمل على إضافة منتجات جديدة قريباً</p>
              <Button asChild>
                <Link href="/">العودة للرئيسية</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
