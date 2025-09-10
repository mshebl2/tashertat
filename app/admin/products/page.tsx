"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, Search, FolderPlus, X } from "lucide-react"
import { productService, type Product } from "@/lib/product-service"
import { db, storage } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { categoriesService, type Category } from "@/lib/categories-service"
import AdminPasswordGuard from "@/components/admin-password-guard"
import AdminLayout from "@/components/admin-layout"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

const ProductForm = ({
  formData,
  onSubmit,
  onCancel,
  onFieldChange,
  onImageUpload,
  uploadedImage,
  isEditing,
  categories,
  isSubmitting,
}: {
  formData: any
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  onFieldChange: (field: string, value: any) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadedImage: string
  isEditing: boolean
  categories: Category[]
  isSubmitting?: boolean
}) => {
  const [sizeValue, setSizeValue] = useState("")
  const [colorValue, setColorValue] = useState("")
  const [printTypeValue, setPrintTypeValue] = useState("")

  const addArrayItem = useCallback(
    (field: "sizes" | "colors" | "printTypes", value: string) => {
      const v = value.trim()
      if (!v) return
      const current = Array.isArray(formData[field]) ? formData[field] : []
      if (current.includes(v)) return
      onFieldChange(field, [...current, v])
    },
    [formData, onFieldChange],
  )

  const removeArrayItem = useCallback(
    (field: "sizes" | "colors" | "printTypes", index: number) => {
      const current = Array.isArray(formData[field]) ? formData[field] : []
      onFieldChange(
        field,
        current.filter((_, i) => i !== index),
      )
    },
    [formData, onFieldChange],
  )
  const handleArrayInput = useCallback(
    (value: string, field: string) => {
      const array = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
      onFieldChange(field, array)
    },
    [onFieldChange],
  )

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">اسم المنتج (عربي)</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => onFieldChange("name", e.target.value)}
            required
            dir="rtl"
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <Label htmlFor="nameEn">اسم المنتج (إنجليزي)</Label>
          <Input
            id="nameEn"
            value={formData.nameEn || ""}
            onChange={(e) => onFieldChange("nameEn", e.target.value)}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">السعر</Label>
          <Input
            id="price"
            type="number"
            value={formData.price || ""}
            onChange={(e) => onFieldChange("price", e.target.value)}
            required
            dir="rtl"
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">السعر الأصلي (اختياري)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice || ""}
            onChange={(e) => onFieldChange("originalPrice", e.target.value)}
            dir="rtl"
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">صورة المنتج</Label>
        <div className="space-y-4">
          <div>
            <Label htmlFor="imageUpload" className="text-sm text-gray-600">
              رفع صورة من الجهاز
            </Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="mt-1"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div className="text-center text-gray-500">أو</div>

          <div>
            <Label htmlFor="imageUrl" className="text-sm text-gray-600">
              رابط الصورة
            </Label>
            <Input
              id="imageUrl"
              value={formData.image}
              onChange={(e) => onFieldChange("image", e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          {(formData.image || uploadedImage) && (
            <div className="mt-4">
              <Label className="text-sm text-gray-600">معاينة الصورة</Label>
              <img
                src={uploadedImage || formData.image}
                alt="معاينة المنتج"
                className="w-32 h-32 object-cover rounded-lg border mt-2"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">الفئة</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => {
              const cat = categories.find((c) => c.ar === value)
              onFieldChange("category", value)
              onFieldChange("categoryEn", cat?.en || "")
            }}
          >
            <SelectTrigger style={{ width: "100%", boxSizing: "border-box" }}>
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat, idx) => (
                <SelectItem key={cat.id || idx} value={cat.ar}>
                  {cat.ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="salePercentage">نسبة الخصم (اختياري)</Label>
          <Input
            id="salePercentage"
            type="number"
            min="0"
            max="100"
            value={formData.salePercentage || ""}
            onChange={(e) => onFieldChange("salePercentage", e.target.value)}
            placeholder="مثال: 20"
            dir="rtl"
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">حالة المنتج</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured || false}
              onChange={(e) => onFieldChange("featured", e.target.checked)}
            />
            <Label htmlFor="featured">منتج مميز</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isNew"
              checked={formData.isNew || false}
              onChange={(e) => onFieldChange("isNew", e.target.checked)}
            />
            <Label htmlFor="isNew">منتج جديد</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isBestSeller"
              checked={formData.isBestSeller || false}
              onChange={(e) => onFieldChange("isBestSeller", e.target.checked)}
            />
            <Label htmlFor="isBestSeller">الأكثر مبيعاً</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOnSale"
              checked={formData.isOnSale || false}
              onChange={(e) => onFieldChange("isOnSale", e.target.checked)}
            />
            <Label htmlFor="isOnSale">عرض وخصم</Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="description">الوصف (عربي)</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
          required
          dir="rtl"
          className="min-h-[100px]"
          style={{ width: "100%", boxSizing: "border-box" }}
        />
      </div>

      <div>
        <Label htmlFor="descriptionEn">الوصف (إنجليزي)</Label>
        <Textarea
          id="descriptionEn"
          value={formData.descriptionEn || ""}
          onChange={(e) => onFieldChange("descriptionEn", e.target.value)}
          required
          className="min-h-[100px]"
          style={{ width: "100%", boxSizing: "border-box" }}
        />
      </div>

      <div>
        <Label htmlFor="notes">ملاحظات إضافية</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => onFieldChange("notes", e.target.value)}
          placeholder="أي ملاحظات خاصة بهذا المنتج..."
          dir="rtl"
          className="min-h-[80px]"
          style={{ width: "100%", boxSizing: "border-box" }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sizes">المقاسات المتوفرة</Label>
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(formData.sizes) ? formData.sizes : []).map((s: string, i: number) => (
                <span key={`${s}-${i}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
                  {s}
                  <button type="button" aria-label="remove" onClick={() => removeArrayItem("sizes", i)} className="text-gray-500 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="sizes"
                value={sizeValue}
                onChange={(e) => setSizeValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addArrayItem("sizes", sizeValue)
                    setSizeValue("")
                  }
                }}
                placeholder="مثال: S أو XL"
                dir="rtl"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              <Button type="button" onClick={() => { addArrayItem("sizes", sizeValue); setSizeValue("") }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">أضف قيمة ثم اضغط +</p>
          </div>
        </div>
        <div>
          <Label htmlFor="colors">الألوان المتوفرة</Label>
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(formData.colors) ? formData.colors : []).map((c: string, i: number) => (
                <span key={`${c}-${i}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
                  {c}
                  <button type="button" aria-label="remove" onClick={() => removeArrayItem("colors", i)} className="text-gray-500 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="colors"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addArrayItem("colors", colorValue)
                    setColorValue("")
                  }
                }}
                placeholder="مثال: أسود"
                dir="rtl"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              <Button type="button" onClick={() => { addArrayItem("colors", colorValue); setColorValue("") }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">أضف قيمة ثم اضغط +</p>
          </div>
        </div>
        <div>
          <Label htmlFor="printTypes">أنواع الطباعة المتوفرة</Label>
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(formData.printTypes) ? formData.printTypes : []).map((t: string, i: number) => (
                <span key={`${t}-${i}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
                  {t}
                  <button type="button" aria-label="remove" onClick={() => removeArrayItem("printTypes", i)} className="text-gray-500 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="printTypes"
                value={printTypeValue}
                onChange={(e) => setPrintTypeValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addArrayItem("printTypes", printTypeValue)
                    setPrintTypeValue("")
                  }
                }}
                placeholder="مثال: مطاطية"
                dir="rtl"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              <Button type="button" onClick={() => { addArrayItem("printTypes", printTypeValue); setPrintTypeValue("") }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">أضف قيمة ثم اضغط +</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? "تحديث المنتج" : "إضافة المنتج"}
        </Button>
      </div>
    </form>
  )
}

ProductForm.displayName = "ProductForm"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "",
    categoryEn: "",
    description: "",
    descriptionEn: "",
    sizes: [] as string[],
    colors: [] as string[],
    printTypes: [] as string[],
    notes: "",
    featured: false,
    isNew: false,
    isBestSeller: false,
    isOnSale: false,
    salePercentage: "",
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
    // Periodic refresh and on visibility
    const intervalId = setInterval(() => {
      loadProducts()
    }, 15000)
    const onVisibility = () => {
      if (!document.hidden) loadProducts()
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      clearInterval(intervalId)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  const sortByCreatedDesc = (arr: Product[]) =>
    [...arr].sort(
      (a, b) =>
        new Date((b as any)?.created_at || 0).getTime() - new Date((a as any)?.created_at || 0).getTime(),
    )

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Loading products via API (admin)...")
      const res = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" })
      const json = await res.json()
      const productsData: Product[] = (Array.isArray(json) ? json : []).map((data: any) => ({
        id: data.id,
        name: data.name || "",
        nameEn: data.nameEn || data.name_en || "",
        price: Number(data.price) || 0,
        originalPrice: data.originalPrice ?? data.original_price ?? undefined,
        image: data.image || "",
        category: data.category || data.category_ar || "",
        categoryEn: data.categoryEn || data.category_en || "",
        description: data.description || "",
        descriptionEn: data.descriptionEn || data.description_en || "",
        sizes: Array.isArray(data.sizes) ? data.sizes : [],
        colors: Array.isArray(data.colors) ? data.colors : [],
        printTypes: data.printTypes || data.print_types || [],
        notes: data.notes || "",
        featured: data.featured ?? data.is_featured ?? false,
        isNew: data.isNew ?? data.is_new ?? false,
        isBestSeller: data.isBestSeller ?? data.is_best_seller ?? false,
        isOnSale: data.isOnSale ?? data.is_on_sale ?? data.isOffer ?? false,
        salePercentage: data.salePercentage ?? data.sale_percentage ?? 0,
        created_at: data.created_at || new Date().toISOString(),
      }))
      console.log("[v0] Loaded products (admin API):", productsData.length)
      setProducts(sortByCreatedDesc(productsData))
    } catch (error) {
      console.error("[v0] Error loading products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const defaultCategories = await categoriesService.getAllCategories()
      setCategories(defaultCategories)

      const response = await fetch("/api/categories")
      if (response.ok) {
        const categoriesData = await response.json()
        const formattedCategories = categoriesData.map((cat: any, idx: number) => ({
          id: (cat.id !== undefined && cat.id !== null) ? String(cat.id) : idx.toString(),
          ar: cat.name,
          en: cat.slug,
        }))
        setCategories(formattedCategories)
      }
    } catch (error) {
      console.error("Error loading categories:", error)
      const defaultCategories = await categoriesService.getAllCategories()
      setCategories(defaultCategories)
    }
  }

  const handleAddCategory = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newCategoryName.trim()) return

      setIsAddingCategory(true)
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCategoryName.trim(),
            slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, "-"),
          }),
        })

        if (response.ok) {
          setNewCategoryName("")
          await loadCategories()
        } else {
          await categoriesService.addCategory(newCategoryName.trim())
          setNewCategoryName("")
          await loadCategories()
        }
      } catch (error) {
        console.error("[v0] Error adding category:", error)
        await categoriesService.addCategory(newCategoryName.trim())
        setNewCategoryName("")
        await loadCategories()
      } finally {
        setIsAddingCategory(false)
      }
    },
    [newCategoryName],
  )

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة؟ قد يؤثر هذا على المنتجات المرتبطة بها.")) {
      await categoriesService.deleteCategory(categoryId)
      await loadCategories()
    }
  }, [])

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    const filterProducts = () => {
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase()
        const results = products.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          (p as any).nameEn?.toLowerCase?.().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p as any).description?.toLowerCase?.().includes(q),
        )
        setFilteredProducts(sortByCreatedDesc(results))
        return
      }
      setFilteredProducts(sortByCreatedDesc(products))
    }
    filterProducts()
  }, [searchQuery, products])

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      nameEn: "",
      price: "",
      originalPrice: "",
      image: "",
      category: "",
      categoryEn: "",
      description: "",
      descriptionEn: "",
      sizes: [],
      colors: [],
      printTypes: [],
      notes: "",
      featured: false,
      isNew: false,
      isBestSeller: false,
      isOnSale: false,
      salePercentage: "",
    })
    setUploadedImage("")
  }, [])

  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)

      console.log("[v0] Form submitted with data:", formData)

      const productData = {
        name: formData.name,
        nameEn: formData.nameEn,
        price: Number.parseFloat(formData.price),
        originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : undefined,
        image: uploadedImage || formData.image,
        category: formData.category,
        categoryEn: formData.categoryEn,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        sizes: formData.sizes,
        colors: formData.colors,
        printTypes: formData.printTypes,
        notes: formData.notes,
        featured: formData.featured,
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        isOnSale: formData.isOnSale,
        salePercentage: formData.salePercentage ? Number.parseFloat(formData.salePercentage) : undefined,
      }

      console.log("[v0] Product data to save:", productData)

      try {
        if (editingProduct) {
          console.log("[v0] Updating product with ID:", editingProduct.id)
          // Use API route to avoid client SDK being blocked by extensions
          const response = await fetch(`/api/products/${editingProduct.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          })
          const result = await response.json()
          if (!response.ok) {
            throw new Error(result?.error || 'Failed to update product')
          }
          console.log("[v0] Update result:", result)
          setEditingProduct(null)
        } else {
          console.log("[v0] Adding new product via API route")

          const response = await fetch("/api/products/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          })

          const result = await response.json()
          console.log("[v0] API response:", result)

          if (!response.ok) {
            throw new Error(result.message || result.error || "Failed to add product")
          }

          console.log("[v0] Product added successfully via API")
          setIsAddDialogOpen(false)
        }

        resetForm()
        console.log("[v0] Reloading products...")
        await loadProducts()
        console.log("[v0] Products reloaded successfully")
      } catch (error) {
        console.error("[v0] Error saving product:", error)
        const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء حفظ المنتج"
        alert(`خطأ: ${errorMessage}`)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, editingProduct, resetForm, uploadedImage],
  )

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      nameEn: (product as any).nameEn,
      price: product.price.toString(),
      originalPrice: (product as any).originalPrice?.toString() || "",
      image: product.image,
      category: product.category,
      categoryEn: (product as any).categoryEn,
      description: product.description,
      descriptionEn: (product as any).descriptionEn,
      sizes: product.sizes,
      colors: product.colors,
      printTypes: (product as any).printTypes,
      notes: (product as any).notes || "",
      featured: (product as any).featured || false,
      isNew: (product as any).isNew || false,
      isBestSeller: (product as any).isBestSeller || false,
      isOnSale: (product as any).isOnSale || false,
      salePercentage: (product as any).salePercentage?.toString() || "",
    })
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        console.log("[v0] Deleting product with ID:", id)
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
        const success = response.ok
        console.log("[v0] Delete result:", success)

        if (success) {
          console.log("[v0] Reloading products after delete...")
          await loadProducts()
          console.log("[v0] Products reloaded after delete")
        } else {
          const err = await response.json().catch(() => ({}))
          alert(err?.error || "فشل في حذف المنتج. يرجى المحاولة مرة أخرى.")
        }
      } catch (error) {
        console.error("[v0] Error deleting product:", error)
        alert("حدث خطأ أثناء حذف المنتج.")
      }
    }
  }, [])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = new FormData()
      data.append('file', file)
      // Try local upload first (no credentials needed during dev)
      let res = await fetch('/api/upload', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok || !json.url) {
        // Fallback to Firebase-admin upload if envs are set
        res = await fetch('/api/storage/upload', { method: 'POST', body: data })
        const json2 = await res.json()
        if (!res.ok || !json2.url) {
          throw new Error(json2.error || json.error || 'Upload failed')
        }
        setUploadedImage(json2.url)
        setFormData((prev) => ({ ...prev, image: json2.url }))
        return
      }
      setUploadedImage(json.url)
      setFormData((prev) => ({ ...prev, image: json.url }))
    } catch (err) {
      console.error('[v0] Image upload failed:', err)
      alert('تعذر رفع الصورة الآن. جرّب مرة أخرى، أو استخدم حقل رابط الصورة مؤقتاً.')
    }
  }, [])

  const handleCancel = useCallback(() => {
    setIsAddDialogOpen(false)
    setEditingProduct(null)
    resetForm()
  }, [resetForm])

  return (
    <AdminPasswordGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={isLoading}>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة منتج جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>إضافة منتج جديد</DialogTitle>
                  <DialogDescription>
                    قم بإضافة منتج جديد وتحديد تفاصيله مثل الاسم والوصف والسعر والمقاسات المتاحة
                  </DialogDescription>
                </DialogHeader>
                <ProductForm
                  formData={formData}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  onFieldChange={handleFieldChange}
                  onImageUpload={handleImageUpload}
                  uploadedImage={uploadedImage}
                  isEditing={false}
                  categories={categories}
                  isSubmitting={isSubmitting}
                />
                {isSubmitting && (
                  <div className="text-center py-4">
                    <p className="text-gray-600">جاري حفظ المنتج...</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5" />
                إدارة الفئات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="اسم الفئة الجديدة..."
                    dir="rtl"
                    style={{ width: "100%", boxSizing: "border-box" }}
                    disabled={isAddingCategory}
                  />
                  <Button type="submit" disabled={isAddingCategory || !newCategoryName.trim()}>
                    {isAddingCategory ? "جاري الإضافة..." : "إضافة فئة"}
                  </Button>
                </form>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {categories.map((category, idx) => (
                    <div key={category.id || idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="text-sm">{category.ar}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              style={{ width: "100%", boxSizing: "border-box" }}
              disabled={isLoading}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">جاري تحميل المنتجات...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <Card key={product.id || idx}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">{product.price} ر.س</span>
                        {(product as any).originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{(product as any).originalPrice} ر.س</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {(product as any).featured && <Badge variant="secondary">مميز</Badge>}
                        {(product as any).isNew && <Badge className="bg-green-500 hover:bg-green-600">جديد</Badge>}
                        {(product as any).isBestSeller && (
                          <Badge className="bg-orange-500 hover:bg-orange-600">الأكثر مبيعاً</Badge>
                        )}
                        {(product as any).isOnSale && (
                          <Badge className="bg-red-500 hover:bg-red-600">
                            خصم {(product as any).salePercentage ? `${(product as any).salePercentage}%` : ""}
                          </Badge>
                        )}
                        <Badge variant="outline">{product.sizes.length} مقاس</Badge>
                        <Badge variant="outline">{product.colors.length} لون</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد منتجات</p>
            </div>
          )}

          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>تعديل المنتج</DialogTitle>
              </DialogHeader>
              <ProductForm
                formData={formData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onFieldChange={handleFieldChange}
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                isEditing={true}
                categories={categories}
                isSubmitting={isSubmitting}
              />
              {isSubmitting && (
                <div className="text-center py-4">
                  <p className="text-gray-600">جاري تحديث المنتج...</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </AdminPasswordGuard>
  )
}
