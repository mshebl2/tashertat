import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productRef = doc(db, "products", params.id)
    const productSnap = await getDoc(productRef)
    if (!productSnap.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(productSnap.data())
  } catch (error) {
    console.error("Error in GET /api/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const mapped: Record<string, unknown> = {
      name: body.name,
      name_en: body.nameEn,
      price: body.price,
      original_price: body.originalPrice ?? null,
      image: body.image,
      category: body.category,
      category_en: body.categoryEn,
      description: body.description,
      description_en: body.descriptionEn,
      sizes: body.sizes,
      colors: body.colors,
      print_types: body.printTypes,
      notes: body.notes,
      is_featured: body.featured ?? body.is_featured,
      is_new: body.isNew ?? body.is_new,
      is_best_seller: body.isBestSeller ?? body.is_best_seller,
      is_on_sale: body.isOnSale ?? body.is_on_sale ?? body.isOffer,
      sale_percentage: body.salePercentage ?? body.sale_percentage ?? null,
    }
    Object.keys(mapped).forEach((k) => mapped[k] === undefined && delete mapped[k])

    await updateDoc(doc(db, "products", params.id), mapped)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in PATCH /api/products/[id]:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteDoc(doc(db, "products", params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error in DELETE /api/products/[id]:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
