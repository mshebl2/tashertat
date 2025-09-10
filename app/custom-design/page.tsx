"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ImageIcon, Palette, Shirt } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function CustomDesignPage() {
  const [isUploading, setIsUploading] = useState(false)

  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("أبيض")
  const [selectedPrintType, setSelectedPrintType] = useState("طباعة رقمية")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [designNotes, setDesignNotes] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  const [customSizes, setCustomSizes] = useState("S, M, L, XL, XXL")
  const [customColors, setCustomColors] = useState("أبيض, أسود, أحمر, أزرق, أخضر, رمادي")
  const [customPrintTypes, setCustomPrintTypes] = useState("طباعة رقمية, طباعة حريرية, طباعة فينيل")

  const sizes = customSizes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  const colors = customColors
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0)
  const printTypes = customPrintTypes
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error("Upload error:", result.error)
        alert(`حدث خطأ في رفع الملف: ${result.error}`)
        return
      }

      setUploadedFile(file)
      setUploadedImageUrl(result.data.publicUrl)
    } catch (error) {
      console.error("Upload error:", error)
      alert("حدث خطأ في رفع الملف")
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddToCart = () => {
    if (!uploadedFile || !customerName || !customerPhone || !uploadedImageUrl) {
      alert("يرجى ملء جميع الحقول المطلوبة ورفع التصميم")
      return
    }

    // Open WhatsApp with uploaded image URL
    const whatsappMessage = `New customer uploaded an image: ${uploadedImageUrl}`
    const whatsappUrl = `https://wa.me/966544089944?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, "_blank")

    const customDesignItem = {
      id: Date.now(), // Unique ID for custom design
      name: "تصميم مخصص - " + customerName,
      price: 120,
      image: uploadedImageUrl, // Use uploaded image URL instead of placeholder
      category: "تصاميم حسب الطلب",
      size: selectedSize,
      color: selectedColor,
      printType: selectedPrintType,
      quantity: 1,
      customDesign: {
        file: uploadedFile,
        imageUrl: uploadedImageUrl, // Store the uploaded image URL
        notes: designNotes,
        customerName,
        customerPhone,
      },
    }

    addItem(customDesignItem)
    alert("تم إضافة التصميم المخصص إلى السلة!")

    // Reset form
    setUploadedFile(null)
    setUploadedImageUrl(null) // Reset uploaded image URL
    setDesignNotes("")
    setCustomerName("")
    setCustomerPhone("")
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">تصاميم حسب الطلب</h1>
          <p className="text-muted-foreground text-lg">ارفع تصميمك الخاص واحصل على تيشيرت فريد يعبر عن شخصيتك</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  رفع التصميم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div>
                  <Label htmlFor="design-upload" className="text-base font-medium">
                    ملف التصميم *
                  </Label>
                  <div className="mt-2">
                    <input
                      id="design-upload"
                      type="file"
                      accept="image/*,.pdf,.ai,.psd"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="design-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      {isUploading ? (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-primary mx-auto mb-2 animate-pulse" />
                          <p className="text-sm font-medium">جاري رفع الملف...</p>
                        </div>
                      ) : uploadedFile ? (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="text-sm font-medium">{uploadedFile.name}</p>
                          <p className="text-xs text-muted-foreground">انقر لتغيير الملف</p>
                          {uploadedImageUrl && <p className="text-xs text-green-600 mt-1">تم رفع الملف بنجاح</p>}
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">انقر لرفع التصميم</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, PDF, AI, PSD (حد أقصى 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer-name">الاسم *</Label>
                    <Input
                      id="customer-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="اسمك الكامل"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-phone">رقم الهاتف *</Label>
                    <Input
                      id="customer-phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Design Notes */}
                <div>
                  <Label htmlFor="design-notes">ملاحظات التصميم</Label>
                  <Textarea
                    id="design-notes"
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    placeholder="أي ملاحظات خاصة بالتصميم أو التطبيق..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customization Options */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="w-5 h-5" />
                  خيارات التخصيص
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="custom-sizes" className="text-base font-medium">
                    المقاسات المتاحة
                  </Label>
                  <Input
                    id="custom-sizes"
                    value={customSizes}
                    onChange={(e) => setCustomSizes(e.target.value)}
                    placeholder="اكتب المقاسات مفصولة بفاصلة (مثال: S, M, L, XL)"
                    className="mt-2"
                    dir="rtl"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                {/* Size Selection */}
                <div>
                  <Label className="text-base font-medium">المقاس</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className="h-10"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-colors" className="text-base font-medium">
                    الألوان المتاحة
                  </Label>
                  <Input
                    id="custom-colors"
                    value={customColors}
                    onChange={(e) => setCustomColors(e.target.value)}
                    placeholder="اكتب الألوان مفصولة بفاصلة (مثال: أبيض, أسود, أحمر)"
                    className="mt-2"
                    dir="rtl"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                {/* Color Selection */}
                <div>
                  <Label className="text-base font-medium">لون التيشيرت</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                        className="h-10"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-print-types" className="text-base font-medium">
                    أنواع الطباعة المتاحة
                  </Label>
                  <Input
                    id="custom-print-types"
                    value={customPrintTypes}
                    onChange={(e) => setCustomPrintTypes(e.target.value)}
                    placeholder="اكتب أنواع الطباعة مفصولة بفاصلة (مثال: طباعة رقمية, طباعة حريرية)"
                    className="mt-2"
                    dir="rtl"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                {/* Print Type */}
                <div>
                  <Label className="text-base font-medium">نوع الطباعة</Label>
                  <div className="space-y-2 mt-2">
                    {printTypes.map((type) => (
                      <Button
                        key={type}
                        variant={selectedPrintType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPrintType(type)}
                        className="w-full justify-start h-10"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">السعر الإجمالي:</span>
                    <div className="text-left">
                      <span className="text-2xl font-bold text-primary">120 ر.س</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">يشمل التصميم والطباعة والتوصيل</p>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full"
                  disabled={!uploadedFile || !customerName || !customerPhone || !uploadedImageUrl || isUploading}
                >
                  إضافة إلى السلة
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  إرشادات التصميم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• دقة الصورة: 300 DPI على الأقل</li>
                  <li>• الحد الأقصى لحجم الملف: 10MB</li>
                  <li>• الصيغ المدعومة: PNG, JPG, PDF, AI, PSD</li>
                  <li>• تجنب الألوان الفاتحة جداً على التيشيرتات البيضاء</li>
                  <li>• سيتم التواصل معك لتأكيد التصميم قبل الطباعة</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
