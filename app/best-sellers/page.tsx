import ProductCard from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { productService } from "@/lib/product-service"

export default async function BestSellersPage() {
  const bestSellerProducts = await productService.getBestSellerProducts()

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-orange-600">{"الأكثر مبيعاً"}</h1>
          <p className="text-muted-foreground text-lg">{"التصاميم الأكثر شعبية وإقبالاً من عملائنا"}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">{"الأكثر مبيعاً"}</Badge>
            </div>
          ))}
        </div>

        {bestSellerProducts.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            <p className="text-xl">{"لا توجد منتجات في قائمة الأكثر مبيعاً حالياً"}</p>
            <p className="mt-2">{"تصفح مجموعتنا الكاملة من المنتجات"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
