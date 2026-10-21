import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse } from "@/lib/server/cors";

const MAX_BYTES = 1_500_000;

function isAllowedAvatarHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "yt3.ggpht.com" ||
    host === "yt3.googleusercontent.com" ||
    host === "lh3.googleusercontent.com" ||
    host.endsWith(".ggpht.com")
  );
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("u")?.trim() || "";
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return new NextResponse(null, { status: 400, headers: corsHeaders(request) });
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    return new NextResponse(null, { status: 400, headers: corsHeaders(request) });
  }
  if (!isAllowedAvatarHost(parsed.hostname)) {
    return new NextResponse(null, { status: 400, headers: corsHeaders(request) });
  }

  const upstream = await fetch(parsed.toString(), {
    headers: { Accept: "image/*" },
    redirect: "follow",
    next: { revalidate: 86400 },
  });
  if (!upstream.ok) {
    return new NextResponse(null, {
      status: 404,
      headers: corsHeaders(request),
    });
  }

  const contentType = upstream.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    return new NextResponse(null, {
      status: 415,
      headers: corsHeaders(request),
    });
  }

  const buffer = await upstream.arrayBuffer();
  if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) {
    return new NextResponse(null, {
      status: 413,
      headers: corsHeaders(request),
    });
  }

  return new NextResponse(buffer, {
    headers: {
      ...corsHeaders(request),
      "Content-Type": contentType.split(";")[0] || "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
