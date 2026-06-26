import { NextRequest, NextResponse } from "next/server";

import { CustomError } from "@/backend/shared/errors";
import { requireAuth } from "@/backend/shared/guards/auth.guard";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const url = req.nextUrl.searchParams.get("url");

    if (!url || !url.startsWith("https://res.cloudinary.com/")) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const upstream = await fetch(url);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "No se pudo obtener el archivo" },
        { status: upstream.status }
      );
    }

    const detectedType = upstream.headers.get("content-type") || "";
    const isPdf =
      url.toLowerCase().includes(".pdf") ||
      detectedType.includes("pdf") ||
      detectedType.includes("octet-stream");
    const contentType = isPdf ? "application/pdf" : detectedType || "application/octet-stream";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
