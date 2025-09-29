// app/lib/api.ts
export type Patrimonio = {
  _id: string;
  id?: number;
  cod_patrimonio: string | null;
  data: string;
  checklist: string;
  localizacao: string;
  filial: string;
  dropbox_link: string;
  arquivo: string;
  content_hash: string;
  client_modified?: string;
  processado_em?: string;
  criado_em?: string;
  atualizado_em?: string;
  ocr_raw?: string;
};

export type PageResp = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: Patrimonio[];
};

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000/api/patrimonios/";

// app/lib/api.ts
export async function getPatrimonios(params: Record<string, string | number | boolean> = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => qs.set(k, String(v)));
  const res = await fetch(`/api/patrimonios?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Falha ao buscar patrimonios (${res.status}) ${t}`);
  }
  return res.json();
}

