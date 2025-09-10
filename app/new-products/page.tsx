import ProductCard from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { productService } from "@/lib/product-service"

export default async function NewProductsPage() {
  const newProducts = await productService.getNewProducts()

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-green-600">{"جديدنا"}</h1>
          <p className="text-muted-foreground text-lg">{"أحدث التصاميم والمنتجات التي وصلت حديثاً"}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">{"جديد"}</Badge>
            </div>
          ))}
        </div>

        {newProducts.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            <p className="text-xl">{"لا توجد منتجات جديدة حالياً"}</p>
            <p className="mt-2">{"تابعنا للحصول على أحدث التصاميم"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
