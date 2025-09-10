"use client"

import { useState, useEffect } from "react"
import { AdminPasswordGuard } from "@/components/admin-password-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"

interface UploadedImage {
  name: string
  url: string
  size: number
  createdAt: string
  updatedAt: string
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadImages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/storage/images")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load images")
      }

      setImages(data.images || [])
    } catch (err) {
      console.error("Error loading images:", err)
      setError(err instanceof Error ? err.message : "Failed to load images")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")
  }

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AdminPasswordGuard>
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الصور المرفوعة</h1>
          <p className="text-gray-600">عرض وإدارة جميع الصور التي تم رفعها من قبل العملاء</p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الصور...</p>
          </div>
        )}

        {error && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-red-600 text-center">
                <p className="font-semibold">خطأ في تحميل الصور</p>
                <p className="text-sm mt-1">{error}</p>
                <Button onClick={loadImages} className="mt-4 bg-transparent" variant="outline">
                  إعادة المحاولة
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && images.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 text-lg">لا توجد صور مرفوعة حتى الآن</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && images.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">إجمالي الصور: {images.length}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <Card key={image.name} className="overflow-hidden">
                  <div className="aspect-square relative bg-gray-100">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`صورة مرفوعة ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/image-not-found.png"
                      }}
                    />
                  </div>

                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium truncate">{image.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2 text-xs text-gray-600 mb-4">
                      <div>الحجم: {formatFileSize(image.size)}</div>
                      <div>تاريخ الرفع: {formatDate(image.createdAt)}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openInNewTab(image.url)} className="flex-1">
                        <ExternalLink className="w-3 h-3 ml-1" />
                        عرض
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(image.url, image.name)}
                        className="flex-1"
                      >
                        <Download className="w-3 h-3 ml-1" />
                        تحميل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminPasswordGuard>
  )
}
