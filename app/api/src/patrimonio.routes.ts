import { NextRequest, NextResponse } from "next/server";

// use var de servidor (sem NEXT_PUBLIC_)
const API_BASE = process.env.API_BASE ?? "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  // encaminha para sua API real (note o /api/patrimonios)
  const upstream = `${API_BASE}/api/patrimonios${url.search}`;
  try {
    const r = await fetch(upstream, { cache: "no-store" });
    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Proxy failed", detail: String(e?.message || e) }, { status: 502 });
  }
}
