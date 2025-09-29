// app/api/patrimonios/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE ?? "http://127.0.0.1:8000"; // sua API real

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  // DRF geralmente precisa da barra final
  const upstream = `${API_BASE}/api/patrimonios/${url.search}`;
  const r = await fetch(upstream, { cache: "no-store" });
  const body = await r.text();
  return new NextResponse(body, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
}
