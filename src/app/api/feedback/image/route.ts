import { NextRequest, NextResponse } from "next/server";
import { canReadFeedback, feedbackImage } from "@/lib/server/feedbackStore";

export const dynamic = "force-dynamic";

/** One feedback screenshot, for the person who runs the app (header x-feedback-key). */
export async function GET(request: NextRequest) {
  if (!canReadFeedback(request.headers.get("x-feedback-key"))) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const dataUrl = await feedbackImage(request.nextUrl.searchParams.get("id") ?? "");
  const match = dataUrl?.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return new NextResponse(Buffer.from(match[2]!, "base64"), {
    headers: { "Content-Type": match[1]!, "Cache-Control": "no-store" },
  });
}
