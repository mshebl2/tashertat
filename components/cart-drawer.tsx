"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { formatWhatsAppMessage, prepareUploadedFilesForSharing } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from "lucide-react"

interface CartDrawerProps {
  children: React.ReactNode
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppCheckout = () => {
    if (state.items.length === 0) return

    const message = formatWhatsAppMessage(state.items, state.total)
    const whatsappUrl = `https://wa.me/966544089944?text=${message}`

    // Check if there are uploaded files
    const uploadedFiles = prepareUploadedFilesForSharing(state.items)

    if (uploadedFiles.length > 0) {
      // Show alert to user about sending files separately
      alert("سيتم فتح واتساب الآن. بعد إرسال تفاصيل الطلب، يرجى إرسال ملفات التصاميم المخصصة في رسائل منفصلة.")

      // Store files in localStorage temporarily for user reference
      const filesInfo = uploadedFiles.map((fileData, index) => ({
        name: fileData.file.name,
        preview: fileData.preview,
        index: index + 1,
      }))
      localStorage.setItem("pendingDesignFiles", JSON.stringify(filesInfo))
    }

    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full sm:w-96"
        aria-describedby="cart-description"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            سلة التسوق
            {state.itemCount > 0 && <Badge variant="secondary">{state.itemCount}</Badge>}
          </SheetTitle>
          <p id="cart-description" className="text-sm text-muted-foreground">
            عرض المنتجات المضافة إلى سلة التسوق وإدارة الكميات
          </p>
          <p id="cart-description" className="text-sm text-muted-foreground">
            عرض المنتجات في سلة التسوق وإدارة الكميات
          </p>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">السلة فارغة</h3>
                <p className="text-muted-foreground">أضف منتجات لتبدأ التسوق</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>المقاس: {item.size}</div>
                          <div>اللون: {item.color}</div>
                          <div>الطباعة: {item.printType}</div>
                          {item.notes && (
                            <div className="text-[11px] text-foreground/80">تفاصيل إضافية: {item.notes}</div>
                          )}
                          {item.uploadedFile && (
                            <div className="text-green-600 flex items-center gap-1">
                              <span>🎨</span>
                              <span>تصميم مخصص: {item.uploadedFile.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-6 h-6 p-0 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-6 h-6 p-0 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">{item.price * item.quantity} ر.س</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-6 h-6 p-0 text-destructive hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Cart Summary */}
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">الإجمالي:</span>
                  <span className="text-xl font-bold text-primary">{state.total} ر.س</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={handleWhatsAppCheckout}>
                    <MessageCircle className="w-5 h-5 ml-2" />
                    إتمام الطلب عبر واتساب
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                    <Trash2 className="w-4 h-4 ml-2" />
                    إفراغ السلة
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  سيتم توجيهك إلى واتساب لإتمام الطلب
                  {prepareUploadedFilesForSharing(state.items).length > 0 && (
                    <div className="mt-1 text-amber-600">📎 تذكير: أرسل ملفات التصاميم بعد تفاصيل الطلب</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
