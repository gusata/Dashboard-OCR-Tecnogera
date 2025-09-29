import { NextRequest, NextResponse } from "next/server";
const API_BASE = process.env.API_BASE ?? "http://127.0.0.1:8000";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.text();
  const upstream = `${API_BASE}/api/patrimonios/${params.id}/`; // barra final!
  try {
    const r = await fetch(upstream, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Proxy failed", detail: String(e?.message || e) }, { status: 502 });
  }
}
