import ProductCard from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { productService } from "@/lib/product-service"

export default async function OffersPage() {
  const saleProducts = await productService.getSaleProducts()

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-red-600">{"عروض وخصومات"}</h1>
          <p className="text-muted-foreground text-lg">{"اغتنم الفرصة واحصل على أفضل العروض والخصومات"}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center text-muted-foreground py-16">
            <p className="text-xl">{"لا توجد عروض متاحة حالياً"}</p>
            <p className="mt-2">{"تابعنا للحصول على أحدث العروض والخصومات"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
