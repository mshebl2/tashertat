"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { productService } from "@/lib/product-service"
import { useCart } from "@/contexts/cart-context"
import { generateCartItemId } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, Upload, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { addItem } = useCart()

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedPrintType, setSelectedPrintType] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productData = await productService.getProductById(params.id)
        if (!productData) {
          setError("Product not found")
          return
        }
        setProduct(productData)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل المنتج...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  const discountPercentage =
    product.salePercentage ||
    (product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor || !selectedPrintType) return

    setIsAdding(true)

    const cartItemId = generateCartItemId(product.id.toString(), selectedSize, selectedColor, selectedPrintType)

    const cartItem = {
      id: cartItemId,
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: selectedSize,
      color: selectedColor,
      printType: selectedPrintType,
      quantity: quantity,
      uploadedFile: uploadedFile || undefined,
      uploadPreview: uploadPreview || undefined,
      notes: notes.trim() || undefined,
    }

    addItem(cartItem)

    // Reset form after adding
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                خصم {discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Upload Preview */}
          {uploadPreview && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">معاينة التصميم المرفوع</h4>
                <div className="relative aspect-video bg-secondary/20 rounded-lg overflow-hidden">
                  <img
                    src={uploadPreview || "/placeholder.svg"}
                    alt="تصميم مرفوع"
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="mr-1 font-semibold">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} تقييم)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">{product.price} ر.س</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">{product.originalPrice} ر.س</span>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>
          </div>

          <Separator />

          {/* Product Options */}
          <div className="space-y-6">
            {/* Size Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">المقاس</Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="flex gap-3 flex-wrap">
                  {(product.sizes || []).map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={size} />
                      <Label
                        htmlFor={size}
                        className="cursor-pointer px-4 py-2 border rounded-md hover:bg-secondary/50"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Color Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">اللون</Label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللون" />
                </SelectTrigger>
                <SelectContent>
                  {(product.colors || []).map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Print Type Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">نوع الطباعة</Label>
              <Select value={selectedPrintType} onValueChange={setSelectedPrintType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الطباعة" />
                </SelectTrigger>
                <SelectContent>
                  {(product.printTypes || []).map((printType) => (
                    <SelectItem key={printType} value={printType}>
                      {printType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-base font-semibold mb-3 block">رفع التصميم (اختياري)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">اضغط لرفع تصميمك الخاص</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF (حد أقصى 10MB)</p>
                </Label>
              </div>
              {uploadedFile && <p className="text-sm text-green-600 mt-2">تم رفع الملف: {uploadedFile.name}</p>}
            </div>

            {/* Additional Notes */}
            <div>
              <Label className="text-base font-semibold mb-3 block">إضافة تفاصيل (اختياري)</Label>
              <Textarea
                placeholder="اكتب أي ملاحظات أو تفاصيل إضافية للطلب"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Quantity */}
            <div>
              <Label className="text-base font-semibold mb-3 block">الكمية</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || !selectedPrintType || isAdding}
            >
              <ShoppingCart className="w-5 h-5 ml-2" />
              {isAdding ? "جاري الإضافة..." : `أضف إلى السلة - ${product.price * quantity} ر.س`}
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                <Heart className="w-5 h-5 ml-2" />
                المفضلة
              </Button>
              <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                <Share2 className="w-5 h-5 ml-2" />
                مشاركة
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">شحن مجاني</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">ضمان الجودة</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">إرجاع مجاني</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
