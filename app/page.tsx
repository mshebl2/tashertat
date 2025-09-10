import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Truck, Shield, Headphones } from "lucide-react"
import { productService } from "@/lib/product-service"
import Link from "next/link"
import RefreshButton from "@/components/refresh-button"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

function normalizeString(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ")
}

// No-op: previous environment validation removed

async function getCategoriesWithProducts() {
  try {
    // Environment validation removed

    const timestamp = Date.now()
    // Use same-origin relative API path to avoid port/domain mismatches in dev
    const baseUrl = ""

    const [categoriesResponse, allProducts] = await Promise.all([
      fetch(`${baseUrl}/api/categories?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
        .then((res) => res.json())
        .catch(() => ({ categories: [] })),
      productService.getAllProducts(),
    ])

    // Support both array and { categories: [...] }
    const dbCategories: Array<{ id: string; name: string; slug?: string }> = Array.isArray(categoriesResponse)
      ? categoriesResponse
      : (categoriesResponse.categories || [])

    console.log(
      "[v0] Database categories:",
      dbCategories.map((c) => c.name),
    )
    console.log("[v0] Product categories:", [...new Set(allProducts.map((p) => p.category))])
    console.log(`[v0] Total products to process: ${allProducts.length}`)

    // Build a card for every Firestore category (even if it has 0 products)
    const categoriesWithProducts = dbCategories.map((category: any) => {
      const categoryProducts = allProducts.filter((product) => {
        // Exact match first
        if (product.category === category.name) return true

        // Category ID match if available
        if (product.category_id === category.id) return true

        const normalizedProductCategory = normalizeString(product.category)
        const normalizedCategoryName = normalizeString(category.name)
        if (normalizedProductCategory === normalizedCategoryName) return true

        // URL encoding match for special characters
        const productSlug = encodeURIComponent(product.category)
        const categorySlug = category.slug || encodeURIComponent(category.name)
        if (productSlug === categorySlug) return true

        // Decoded URL match
        try {
          const decodedProductCategory = decodeURIComponent(product.category)
          const decodedCategoryName = decodeURIComponent(category.name)
          if (normalizeString(decodedProductCategory) === normalizeString(decodedCategoryName)) return true
        } catch (e) {
          // Ignore decoding errors
        }

        return false
      })

      console.log(`[v0] Category "${category.name}" matched ${categoryProducts.length} products:`)
      categoryProducts.forEach((product) => {
        console.log(`[v0]   - Product: "${product.name}" (category: "${product.category}")`)
      })

      const firstWithImage = categoryProducts.find((p: any) => p?.image)
      const firstCreatedAt = categoryProducts
        .map((p: any) => new Date((p as any)?.created_at || 0).getTime())
        .filter((n: number) => Number.isFinite(n) && n > 0)
        .sort((a: number, b: number) => a - b)[0]
      return {
        id: category.id,
        name: category.name,
        slug: category.slug || category.name,
        image: firstWithImage?.image || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(category.name)}`,
        count: categoryProducts.length,
        products: categoryProducts.slice(0, 4),
        firstCreatedAt: firstCreatedAt || 0,
        description: `تصاميم ${category.name} المميزة`,
      }
    })

    const matchedProductIds = new Set(categoriesWithProducts.flatMap((cat: { products: Array<{ id: string }> }) => cat.products.map((p: { id: string }) => p.id)))
    const unmatchedProducts = allProducts.filter((product) => !matchedProductIds.has(product.id))

    console.log(`[v0] Matched products: ${matchedProductIds.size}`)
    console.log(`[v0] Unmatched products: ${unmatchedProducts.length}`)

    if (unmatchedProducts.length > 0) {
      console.log("[v0] Creating dynamic categories for unmatched products:")
      unmatchedProducts.forEach((product) => {
        console.log(`[v0]   - "${product.name}" with category "${product.category}"`)
      })

      // Create dynamic categories for unmatched products with normalization
      const uniqueCategories = [...new Set(unmatchedProducts.map((p) => normalizeString(p.category)))]

      const dynamicCategories = uniqueCategories.map((normalizedCategoryName) => {
        // Find the original category name (first occurrence)
        const originalCategoryName =
          unmatchedProducts.find((p) => normalizeString(p.category) === normalizedCategoryName)?.category ||
          normalizedCategoryName

        const categoryProducts = unmatchedProducts.filter((p) => normalizeString(p.category) === normalizedCategoryName)

        console.log(`[v0] Dynamic category "${originalCategoryName}" created with ${categoryProducts.length} products`)

        const firstWithImage = categoryProducts.find((p) => (p as any)?.image)
        const firstCreatedAt = categoryProducts
          .map((p: any) => new Date((p as any)?.created_at || 0).getTime())
          .filter((n: number) => Number.isFinite(n) && n > 0)
          .sort((a: number, b: number) => a - b)[0]
        return {
          id: `dynamic-${encodeURIComponent(originalCategoryName)}`,
          name: originalCategoryName,
          slug: originalCategoryName,
          image: firstWithImage?.image || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(originalCategoryName)}`,
          count: categoryProducts.length,
          products: categoryProducts.slice(0, 4),
          firstCreatedAt: firstCreatedAt || 0,
          description: `تصاميم ${originalCategoryName} المميزة`,
        }
      })

      // Append dynamic categories in addition to Firestore categories
      ;(categoriesWithProducts as any[]).push(...(dynamicCategories as any[]))
      console.log(`[v0] Added ${dynamicCategories.length} dynamic categories`)
    }

    // Sort: الأحدث يميناً (descending)
    ;(categoriesWithProducts as any[]).sort((a: any, b: any) => (b.firstCreatedAt || 0) - (a.firstCreatedAt || 0))

    console.log(`[v0] Final categories count: ${categoriesWithProducts.length}`)
    console.log("[v0] Categories summary:")
    categoriesWithProducts.forEach((cat: { name: string; count: number }) => {
      console.log(`[v0]   - "${cat.name}": ${cat.count} products`)
    })

    return categoriesWithProducts
  } catch (error) {
    console.error("[v0] Error fetching categories with products:", error)
    return []
  }
}

export default async function HomePage() {
  console.log("[v0] Homepage loading, checking ProductService...")

  try {
    const timestamp = Date.now()
    console.log(`[v0] Loading homepage with timestamp: ${timestamp}`)

    const [featuredProducts, newProducts, bestSellerProducts, saleProducts, categoriesWithProducts] = await Promise.all(
      [
        productService.getFeaturedProducts().then((products) => {
          console.log("[v0] Featured products loaded:", products.length)
          return products.slice(0, 4)
        }),
        productService.getNewProducts().then((products) => {
          console.log("[v0] New products loaded:", products.length)
          return products.slice(0, 4)
        }),
        productService.getBestSellerProducts().then((products) => {
          console.log("[v0] Best seller products loaded:", products.length)
          return products.slice(0, 4)
        }),
        productService.getSaleProducts().then((products) => {
          console.log("[v0] Sale products loaded:", products.length)
          return products.slice(0, 4)
        }),
        getCategoriesWithProducts(),
      ],
    )

    console.log("[v0] All products loaded successfully")
    console.log(
      `[v0] Final homepage data: ${categoriesWithProducts.length} categories, ${featuredProducts.length} featured, ${newProducts.length} new, ${bestSellerProducts.length} best sellers, ${saleProducts.length} sale products`,
    )

    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <RefreshButton />
        </div>

        {/* Hero Banner */}
        <section className="relative bg-gradient-to-l from-primary/10 to-secondary/20 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-right">
                <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
                  {"اطبع تصميمك المميز على تيشيرت عالي الجودة"}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 text-pretty">
                  {"اختر من مجموعة واسعة من التصاميم الجاهزة أو ارفع تصميمك الخاص واحصل على تيشيرت فريد يعبر عن شخصيتك"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/products">
                    <Button size="lg" className="text-lg px-8">
                      {"تصفح المنتجات"}
                    </Button>
                  </Link>
                  <Link href="/custom-design">
                    <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                      {"صمم تيشيرتك"}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/custom-t-shirt-printing-showcase.png"
                  alt="تيشيرتات مخصصة"
                  className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{"شحن سريع"}</h3>
                <p className="text-sm text-muted-foreground">{"توصيل خلال 2-3 أيام عمل"}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{"جودة عالية"}</h3>
                <p className="text-sm text-muted-foreground">{"خامات ممتازة وطباعة دائمة"}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{"دعم 24/7"}</h3>
                <p className="text-sm text-muted-foreground">{"خدمة عملاء متاحة دائماً"}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{"تصاميم حصرية"}</h3>
                <p className="text-sm text-muted-foreground">{"مكتبة ضخمة من التصاميم المميزة"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{"المنتجات المميزة"}</h2>
              <p className="text-muted-foreground">{"أحدث وأفضل تصاميمنا"}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* New Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{"جديدنا"}</h2>
              <p className="text-muted-foreground">{"أحدث التصاميم التي وصلت حديثاً"}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">{"جديد"}</Badge>
                </div>
              ))}
            </div>
            {newProducts.length === 0 && (
              <div className="text-center text-muted-foreground">{"لا توجد منتجات جديدة حالياً"}</div>
            )}
            <div className="text-center mt-8">
              <Link href="/new-products">
                <Button variant="outline" size="lg">
                  {"عرض جميع المنتجات الجديدة"}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{"الأكثر مبيعاً"}</h2>
              <p className="text-muted-foreground">{"التصاميم الأكثر شعبية بين عملائنا"}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellerProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">{"الأكثر مبيعاً"}</Badge>
                </div>
              ))}
            </div>
            {bestSellerProducts.length === 0 && (
              <div className="text-center text-muted-foreground">{"لا توجد منتجات في قائمة الأكثر مبيعاً حالياً"}</div>
            )}
            <div className="text-center mt-8">
              <Link href="/best-sellers">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  {"عرض جميع المنتجات الأكثر مبيعاً"}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Sale Products */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-red-600">{"عروض وخصومات"}</h2>
              <p className="text-muted-foreground">{"اغتنم الفرصة واحصل على أفضل العروض"}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                    {product.salePercentage ? `خصم ${product.salePercentage}%` : "خصم"}
                  </Badge>
                </div>
              ))}
            </div>
            {saleProducts.length === 0 && (
              <div className="text-center text-muted-foreground">{"لا توجد عروض متاحة حالياً"}</div>
            )}
            <div className="text-center mt-8">
              <a href="http://localhost:3003/offers">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  {"عرض جميع العروض والخصومات"}
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error("[v0] Error loading products:", error)
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">{"حدث خطأ أثناء تحميل المنتجات"}</h2>
            <p className="text-muted-foreground">{"يرجى المحاولة مرة أخرى لاحقاً"}</p>
          </div>
        </div>
      </div>
    )
  }
}
