import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getStorage } from "firebase-admin/storage"

export const runtime = "nodejs"

// Initialize firebase-admin once
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
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'perfume-eb466.appspot.com',
    })
  } else {
    // Fallback to ADC (GOOGLE_APPLICATION_CREDENTIALS) or emulator
    initializeApp({
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'perfume-eb466.appspot.com',
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: 'file is required' }, { status: 400 })
    }

    const bucket = getStorage().bucket()
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const destFile = bucket.file(`products/${id}-${file.name}`)
    const arrayBuffer = await file.arrayBuffer()
    const token = (globalThis as any).crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
    await destFile.save(Buffer.from(arrayBuffer), {
      resumable: false,
      metadata: {
        contentType: file.type || 'application/octet-stream',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    })
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destFile.name)}?alt=media&token=${token}`
    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ success: false, error: message, hint: 'Configure FIREBASE_* env vars or GOOGLE_APPLICATION_CREDENTIALS' }, { status: 500 })
  }
}
