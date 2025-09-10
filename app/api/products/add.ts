import { NextRequest, NextResponse } from "next/server";
import { addProduct } from "@/lib/add-product";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const id = await addProduct(data);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
