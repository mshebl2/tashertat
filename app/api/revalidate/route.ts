import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting comprehensive cache revalidation...")

    revalidatePath("/")
    revalidatePath("/products")
    revalidatePath("/category/[slug]", "page")
    revalidatePath("/admin/products")
    revalidatePath("/admin/dashboard")

    revalidatePath("/api/products")
    revalidatePath("/api/categories")
    revalidatePath("/api/products/add")

    revalidateTag("products")
    revalidateTag("categories")

    console.log("[v0] Cache revalidation completed successfully")

    return NextResponse.json({
      revalidated: true,
      message: "All pages and API routes revalidated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error("[v0] Error during revalidation:", err)
    return NextResponse.json(
      {
        revalidated: false,
        message: "Error revalidating cache",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
