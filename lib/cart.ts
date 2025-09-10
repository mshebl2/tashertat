export interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  image: string
  category: string
  size: string
  color: string
  printType: string
  quantity: number
  uploadedFile?: File
  uploadPreview?: string
  notes?: string
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

export const generateCartItemId = (productId: number, size: string, color: string, printType: string): string => {
  return `${productId}-${size}-${color}-${printType}`
}

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export const formatWhatsAppMessage = (items: CartItem[], total: number): string => {
  let message = "مرحباً، أريد طلب المنتجات التالية:\n\n"
  let hasUploadedFiles = false

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    message += `   المقاس: ${item.size}\n`
    message += `   اللون: ${item.color}\n`
    message += `   نوع الطباعة: ${item.printType}\n`
    message += `   الكمية: ${item.quantity}\n`
    message += `   السعر: ${item.price * item.quantity} ر.س\n`
    if (item.notes) {
      message += `   تفاصيل إضافية: ${item.notes}\n`
    }
    if (item.uploadedFile) {
      message += `   🎨 تصميم مخصص مرفق: ${item.uploadedFile.name}\n`
      hasUploadedFiles = true
    }
    message += "\n"
  })

  message += `الإجمالي: ${total} ر.س\n\n`

  if (hasUploadedFiles) {
    message += "📎 ملاحظة: يوجد تصاميم مخصصة مرفقة مع الطلب\n"
    message += "سأقوم بإرسال ملفات التصاميم في رسائل منفصلة\n\n"
  }

  message += "شكراً لكم"

  return encodeURIComponent(message)
}

export const prepareUploadedFilesForSharing = (items: CartItem[]): { file: File; preview: string }[] => {
  return items
    .filter((item) => item.uploadedFile && item.uploadPreview)
    .map((item) => ({
      file: item.uploadedFile!,
      preview: item.uploadPreview!,
    }))
}
