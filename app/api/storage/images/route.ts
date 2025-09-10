// TODO: implement Firebase Storage image listing logic here

export async function GET() {
  try {
    // Placeholder: return sample images
    const mockImages = [
      {
        name: "sample-design-1.png",
        url: "/custom-t-shirt-design-1.jpg",
        size: 156789,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: "sample-design-2.jpg",
        url: "/custom-t-shirt-design-2.jpg",
        size: 234567,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        name: "sample-design-3.png",
        url: "/custom-t-shirt-design-3.jpg",
        size: 189234,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]
    return Response.json({ images: mockImages, message: "Firebase Storage image listing not implemented yet." })
  } catch (error) {
    return Response.json({ images: [], error: "Internal server error" }, { status: 500 })
  }
}
