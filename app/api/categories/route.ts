import { type NextRequest, NextResponse } from "next/server"
import { getApps, initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { collection, getDocs, orderBy, query, addDoc, deleteDoc, doc } from "firebase/firestore"
import { db as clientDb } from "@/lib/firebase"

export const runtime = "nodejs"

// Ensure firebase-admin is initialized once for server-side privileged access
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
  } else {
    // Fallback to ADC (GOOGLE_APPLICATION_CREDENTIALS) if available
    initializeApp()
  }
}

export async function GET() {
  try {
    console.log("[v0] GET /api/categories - Starting")

    // For reads, client SDK is sufficient and avoids requiring admin in dev
    const categoriesRef = collection(clientDb, "categories")
    const q = query(categoriesRef, orderBy("name"))
    const querySnapshot = await getDocs(q)

    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log("[v0] Categories fetched successfully:", categories?.length || 0, "categories")
    console.log("[v0] Categories data:", JSON.stringify(categories, null, 2))

    return NextResponse.json(categories || [])
  } catch (error) {
    console.error("[v0] Error in GET /api/categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const now = new Date().toISOString()
    const payload = {
      name: body.name,
      slug: body.slug || body.name,
      created_at: now,
    }

    try {
      const adminDb = getFirestore()
      const docRef = await adminDb.collection("categories").add(payload)
      return NextResponse.json({ id: docRef.id, ...payload })
    } catch (e) {
      // Fallback to client SDK write if admin is not configured locally
      const docRef = await addDoc(collection(clientDb, "categories"), payload as any)
      return NextResponse.json({ id: docRef.id, ...payload })
    }
  } catch (error) {
    console.error("Error in POST /api/categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    try {
      const adminDb = getFirestore()
      await adminDb.collection("categories").doc(id).delete()
    } catch (e) {
      // Fallback to client SDK delete if admin is not configured locally
      await deleteDoc(doc(clientDb, "categories", id))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
