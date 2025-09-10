import { NextResponse } from "next/server"
// Use firebase-admin to bypass client security rules on the server
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { collection, addDoc } from "firebase/firestore"
import { db as clientDb } from "@/lib/firebase"

export const runtime = "nodejs"

function ensureAdminApp() {
  if (getApps().length) return;
  const hasInline = !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  )
  if (hasInline) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey,
      }),
    })
    return
  }
  // If GOOGLE_APPLICATION_CREDENTIALS points to a json, admin SDK can pick it
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      initializeApp()
      return
    } catch {}
  }
  console.warn('[v0] Firebase Admin credentials not found; will fallback to client SDK writes')
  return
}

export async function POST(request: Request) {
  try {
    const hasAdminEnv = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) || !!process.env.GOOGLE_APPLICATION_CREDENTIALS
    let adminDb: ReturnType<typeof getFirestore> | null = null
    if (hasAdminEnv) {
      try {
        ensureAdminApp()
        adminDb = getFirestore()
      } catch (e) {
        adminDb = null
      }
    }

    const body = await request.json()

    const rawImage = typeof body.image === 'string' ? body.image : ''
    const safeImage = rawImage && rawImage.startsWith('data:') && rawImage.length > 300_000 ? '' : rawImage

    const productData = {
      name: body.name || '',
      description: body.description || '',
      price: Number(body.price || 0),
      original_price: body.originalPrice ?? null,
      image: safeImage,
      category: body.category || '',
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      print_types: Array.isArray(body.printTypes) ? body.printTypes : [],
      notes: body.notes || '',
      is_featured: !!body.featured,
      is_new: !!body.isNew,
      is_best_seller: !!body.isBestSeller,
      is_on_sale: !!body.isOnSale,
      sale_percentage: body.salePercentage ?? null,
      created_at: new Date().toISOString(),
    }

    if (adminDb) {
      try {
        const docRef = await adminDb.collection('products').add(productData as any)
        return NextResponse.json({ id: docRef.id, ...productData })
      } catch (e) {
        // fall through to client SDK
      }
    }

    // Client SDK write (works if Firestore rules allow writes during dev)
    const clientDocRef = await addDoc(collection(clientDb, 'products'), productData as any)
    return NextResponse.json({ id: clientDocRef.id, ...productData })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to add product' }, { status: 500 })
  }
}
