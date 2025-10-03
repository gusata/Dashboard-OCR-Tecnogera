import { NextRequest, NextResponse } from "next/server";
const API_BASE = process.env.API_BASE ?? "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const r = await fetch(`${API_BASE}/api/metrics/timeseries/${url.search}`, { cache: "no-store" });
  const body = await r.text();
  return new NextResponse(body, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" }});
}
