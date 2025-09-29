// pages/api/patrimonios.ts
import type { NextApiRequest, NextApiResponse } from "next";

const API_BASE = process.env.API_BASE ?? "http://127.0.0.1:8000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const qs = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  const upstream = `${API_BASE}/api/patrimonios/${qs}`;
  try {
    const r = await fetch(upstream, { cache: "no-store" });
    const body = await r.text();
    res
      .status(r.status)
      .setHeader("content-type", r.headers.get("content-type") ?? "application/json")
      .send(body);
  } catch (e: any) {
    res.status(502).json({ error: "Proxy failed", detail: String(e?.message || e) });
  }
}
