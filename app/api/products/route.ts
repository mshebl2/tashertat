import { NextResponse } from "next/server"
import { db as clientDb } from "@/lib/firebase"
import { collection, getDocs, orderBy, query, addDoc } from "firebase/firestore"
import { getApps, initializeApp, cert } from "firebase-admin/app"
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore"

const FALLBACK_PRODUCTS = [
  {
    id: "fallback-1",
    name: "مثال منتج 1",
    description: "هذا منتج تجريبي - يرجى إعداد قاعدة البيانات",
    price: 50,
    category: "تصاميم سعودية",
    image: "/placeholder.svg?height=400&width=400",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أبيض", "أسود"],
    print_types: ["طباعة عادية"],
    is_featured: false,
    is_new: false,
    is_best_seller: false,
    is_on_sale: false,
    created_at: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    console.log("[v0] GET /api/products - Starting")

    const productsRef = collection(clientDb, "products")
    let querySnapshot
    try {
      const q = query(productsRef, orderBy("created_at", "desc"))
      querySnapshot = await getDocs(q)
    } catch (err) {
      console.warn("[v0] orderBy('created_at') failed or not indexed; falling back to unordered fetch:", err)
      querySnapshot = await getDocs(productsRef)
    }
    if (querySnapshot.empty) {
      console.warn("[v0] Products query returned 0. Retrying without orderBy just in case...")
      querySnapshot = await getDocs(productsRef)
    }

    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log("[v0] Products fetched successfully:", products?.length || 0, "products")
    return NextResponse.json(products || FALLBACK_PRODUCTS)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json(FALLBACK_PRODUCTS)
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] POST /api/products - Starting")

    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    // Try admin first
    try {
      if (getApps().length === 0) {
        const hasEnv = !!(
          process.env.FIREBASE_PROJECT_ID &&
          process.env.FIREBASE_CLIENT_EMAIL &&
          process.env.FIREBASE_PRIVATE_KEY
        )
        if (hasEnv) {
          initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_PROJECT_ID as string,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
              privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
            }),
          })
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          initializeApp()
        }
      }
      const adminDb = getAdminFirestore()
      const now = new Date().toISOString()
      const payload = { ...body, created_at: body?.created_at || now }
      const adminDoc = await adminDb.collection("products").add(payload as any)
      console.log("[v0] Product created with admin:", { id: adminDoc.id })
      return NextResponse.json({ id: adminDoc.id, ...payload })
    } catch (e) {
      console.warn("[v0] Admin write failed, falling back to client SDK:", e)
      const productsRef = collection(clientDb, "products")
      const now = new Date().toISOString()
      const payload = { ...body, created_at: body?.created_at || now }
      const docRef = await addDoc(productsRef, payload)
      console.log("[v0] Product created with client SDK:", { id: docRef.id })
      return NextResponse.json({ id: docRef.id, ...payload })
    }
  } catch (error) {
    console.error("[v0] Error in POST /api/products:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
