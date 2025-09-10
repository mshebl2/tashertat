"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/product-service"
import { useState, useEffect } from "react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    console.log(`[CLIENT] ProductCard mounted for: ${product.name}`)
    console.log(`[CLIENT] Product data:`, {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      hasImage: !!product.image,
      imageSize: product.image?.length || 0,
    })
  }, [product])

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const getImageSrc = () => {
    if (!imageError && product.image) {
      return product.image
    }
    return `/placeholder.svg?height=256&width=256&query=${encodeURIComponent(product.name + " تيشيرت")}`
  }

  const handleImageError = () => {
    console.log(`[CLIENT] Image error for product: ${product.name}`)
    setImageError(true)
  }

  if (!isMounted) {
    return (
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow animate-pulse">
        <CardContent className="p-0">
          <div className="w-full h-64 bg-gray-200 rounded-t-lg"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary/20">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <div
            className="relative overflow-hidden rounded-t-lg"
            style={{
              backgroundImage: `url(${getImageSrc()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src={getImageSrc()}
              alt={product.name}
              className="w-full h-64 object-cover opacity-0"
              onError={handleImageError}
              loading="lazy"
            />

            {discountPercentage > 0 && (
              <Badge variant="destructive" className="absolute top-3 right-3">
                خصم {discountPercentage}%
              </Badge>
            )}

            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">متاح</div>
          </div>
        </Link>

        <div className="p-4 bg-white">
          <Badge variant="outline" className="mb-2 text-xs bg-primary/10">
            {product.category}
          </Badge>

          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold mb-2 text-balance hover:text-primary transition-colors text-lg">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">{product.price} ر.س</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">{product.originalPrice} ر.س</span>
              )}
            </div>
            <Link href={`/product/${product.id}`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                عرض المنتج
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
