import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.tag) {
      return NextResponse.json(
        { error: "Tag is required for revalidation." },
        { status: 400 }
      );
    }
    revalidateTag(data.tag);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revalidating tag:", error);
    return NextResponse.json(
      { error: "Failed to revalidate tag." },
      { status: 500 }
    );
  }
}
