import { NextResponse, type NextRequest } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: "file is required" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const safeBase = (file.name || "upload").replace(/[^a-zA-Z0-9_.-]/g, "_")
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeBase}`
    const filePath = path.join(uploadsDir, filename)
    await fs.writeFile(filePath, buffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("[v0] Local upload error:", error)
    return NextResponse.json({ success: false, error: "Local upload failed" }, { status: 500 })
  }
}



