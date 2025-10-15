'use client'

import * as React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import MuiBox from "@mui/material/Box";
import MuiButton from "@mui/material/Button";
import MuiDialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiTextField from "@mui/material/TextField";
import { getPatrimonios } from "../lib/api";
import Sidebar from "../components/nav";
import { History, HistoryIcon } from "lucide-react";

// --- utils ---
const dropboxToRaw = (url: string) => {
  if (!url) return "";
  const base = url.replace(/([?&])(dl=\d|raw=1)/g, "").replace(/[?&]$/, "");
  return base + (base.includes("?") ? "&raw=1" : "?raw=1");
};

const norm = (s?: string) => (s ?? "").trim().toUpperCase();


const isPend = (s?: string) => !!s && /^pend/i.test(s.trim());



export default function Arquivos() {

type Row = {
  id: string;
  backendId: string;   // <— novo: ID que o DRF espera
  foto: string;
  patrimonio?: string;
  checklist?: string;
  filial?: string;
  data: string;
};

const [historyOpen, setHistoryOpen] = React.useState(false);
const [historyLoading, setHistoryLoading] = React.useState(false);
const [historyItems, setHistoryItems] = React.useState<Row[]>([]);
const [historyTarget, setHistoryTarget] = React.useState<string>("");

async function loadHistoryByPatrimonio(patrimonio: string) {
  setHistoryLoading(true);
  try {
    // tente usar o filtro do seu backend (ajuste a chave se necessário):
    const data = await getPatrimonios({
      page: 1,
      limit: 200,
      sort: "processado_em,-1",
      patrimonio,           // se sua API aceita "cod_patrimonio", troque aqui
      hasPatrimonio: true,
    });

    const items: any[] =
      Array.isArray(data) ? data :
      Array.isArray((data as any)?.items) ? (data as any).items :
      Array.isArray((data as any)?.results) ? (data as any).results :
      [];

    const mapped: Row[] = items.map((it: any) => {
      const backendId = String(it.id);
      return {
        id: backendId,
        backendId,
        foto: it.dropbox_link ?? it.foto ?? "",
        patrimonio: it.cod_patrimonio ?? it.patrimonio ?? "",
        checklist: it.checklist ?? "",
        filial: it.filial ?? "",
        data: it.data ?? "",
      };
    });

    // 🔒 filtro exato no cliente (garante 100%)
    const alvo = norm(patrimonio);
    const estritamenteIguais = mapped.filter(it => norm(it.patrimonio) === alvo);

    setHistoryItems(estritamenteIguais);
  } catch (err) {
    console.error("Falha ao carregar histórico:", err);
    setHistoryItems([]);
  } finally {
    setHistoryLoading(false);
  }
}


function handleOpenHistory(row: Row) {
  const alvo = (row.patrimonio ?? "").trim();
  setHistoryTarget(alvo);
  setHistoryItems([]);
  setHistoryOpen(true);

  if (!alvo) return;           // sem patrimônio, só abre o aviso
  loadHistoryByPatrimonio(alvo);
}


function Pill({
  tone,
  children,
  className = "",
}: {
  tone: "ok" | "bad" | "neutral";
  children: React.ReactNode;
  className?: string;
}) {
  const map = {
    ok: "bg-green-300/50 h-8/12 flex justify-center items-center text-green-800 border-b-green-700 border-b-3",
    bad: "bg-red-300/50 h-8/12 flex justify-center items-center text-red-800 border-b-red-700 border-b-3",
    neutral: "bg-zinc-300/50 h-8/12 flex justify-center items-center text-gray-800 border-b-zinc-700 border-b-3",
  } as const;
  return (
    <span
      className={`items-center justify-center self-center mt-1.5 -m-0.5 flex rounded-lg px-3 py-1 text-xs font-semibold ${map[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

const [saving, setSaving] = React.useState(false); //Salvar no banco

  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState<Row | null>(null);
  const [fPatrimonio, setFPatrimonio] = React.useState("");
  const [fChecklist, setFChecklist] = React.useState("");
  const [fFilial, setFFilial] = React.useState("");
  const [fData, setFData] = React.useState("");

  // Busca os dados da API na montagem
  React.useEffect(() => {
    (async () => {
      try {
        const data = await getPatrimonios({
          page: 1,
          limit: 20,
          from: "2025-09-25",
          to: "2025-09-29",
          checklist: "217088",
          hasPatrimonio: false,
          sort: "processado_em,-1",
        });

        const items: any[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.items)
          ? (data as any).items
          : Array.isArray((data as any)?.results)
          ? (data as any).results
          : [];

          if (!Array.isArray(items)) {
            console.warn("Formato inesperado da API:", data);
          }

          


       const mapped: Row[] = items.map((it: any) => {
        const backendId = String(it.id); // << DRF ID (inteiro)
        return {
          id: backendId,       // pode usar o mesmo no DataGrid
          backendId,           // <- adicione esta prop no tipo Row
          foto: it.dropbox_link ?? it.foto ?? "",
          patrimonio: it.cod_patrimonio ?? it.patrimonio ?? "",
          checklist: it.checklist ?? "",
          filial: it.filial ?? "",
          data: it.data ?? "",
        };
      });
      setRows(mapped);

        setRows(mapped);
      } catch (e) {
        console.error("Falha ao carregar patrimonios", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOpen = (row: Row) => {
    setCurrentRow(row);
    setFPatrimonio(row.patrimonio ?? "");
    setFChecklist(row.checklist ?? "");
    setFFilial(row.filial ?? "");
    setFData(row.data ?? "");
    setOpen(true);
  };

  const handleSave = async () => {
    if (!currentRow) return;
    setSaving(true);
    try {
      const resp = await fetch(`/api/patrimonios/${encodeURIComponent(currentRow.backendId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cod_patrimonio: fPatrimonio.trim() }),
      });
      if (!resp.ok) {
        const t = await resp.text().catch(() => "");
        throw new Error(`Falha ao salvar (${resp.status}) ${t}`);
      }
      setRows(prev => prev.map(r => r.id === currentRow.id ? { ...r, patrimonio: fPatrimonio.trim() } : r));
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("Não foi possível salvar o patrimônio.");
    } finally {
      setSaving(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "foto",
      headerName: "Foto",
      flex: 2,
      renderCell: (p) => {
        const rowPend = isPend(p.row.patrimonio);
        const link = String(p.value || "");
        const tone: "ok" | "bad" = rowPend ? "bad" : (link ? "ok" : "bad");
        return link ? (
          <a
            href={dropboxToRaw(link)}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-[500px] truncate"
            title={link}
          >
            <Pill tone={tone} className="flex justify-start truncate">
              {link}
            </Pill>
          </a>
        ) : (
          <Pill tone="bad" className="flex justify-start truncate">sem link</Pill>
        );
      },
    },
    {
      field: "patrimonio",
      headerName: "Patrimônio",
      flex: 1,
      renderCell: (p) => {
        const val = String(p.value ?? "");
        const rowPend = isPend(val);
        const tone: "ok" | "bad" = val && !rowPend ? "ok" : "bad";
        return <Pill tone={tone} className="w-24 truncate">{val || "-"}</Pill>;
      },
    },

    {
      field: "data",
      headerName: "Data",
      flex:1,
      renderCell: (p) => {
        const rowPend = isPend(p.row.data);
        const val = String(p.value ?? "");
        const tone: "ok" | "bad" = rowPend ? "bad" : (val ? "ok" : "bad");
        return <Pill tone={tone} className="w-24 truncate">{val || "-"}</Pill>;
      },
    },

    {
      field: "checklist",
      headerName: "Checklist",
      flex: 1,
      renderCell: (p) => {
        const rowPend = isPend(p.row.patrimonio);
        const val = String(p.value ?? "");
        const tone: "ok" | "bad" = rowPend ? "bad" : (val ? "ok" : "bad");
        return <Pill tone={tone} className="w-24 truncate">{val || "-"}</Pill>;
      },
    },
    {
      field: "filial",
      headerName: "Filial",
      flex: 0.7,
      renderCell: (p) => {
        const rowPend = isPend(p.row.patrimonio);
        const tone: "neutral" | "bad" = rowPend ? "bad" : "neutral";
        return <Pill tone={tone as any} className="w-24 truncate justify-start flex">{String(p.value ?? " ")}</Pill>;
      },
    },
    {
      field: "validar",
      headerName: "",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      flex: 0.6,
      renderCell: (p) => (
        <button
          onClick={() => handleOpen(p.row as Row)}
          className="bg-blue-600 h-8/12 w-24 flex cursor-pointer justify-center mt-1.5 items-center self-center rounded-lg text-white border-2"
        >
          Validar
        </button>
      ),
    },
    {
      field: "history",
      headerName: "",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      flex: 0.6,
      renderCell: (p) => (
        <button
          onClick={() => handleOpenHistory(p.row as Row)}
          className="bg-blue-600 h-9 w-9 cursor-pointer flex justify-center mt-1.5 items-center self-center rounded-full text-white border-2"
          title="Ver histórico deste patrimônio"
        >
          <HistoryIcon />
        </button>
      ),
    },
  ];


  return (
    <section className="flex bg-back flex-col justify-center items-end overflow-y-hidden px-3" id="arquivos">
      <div className="pb-5 w-10/12">
        <span className="from-amber-500 via-amber-500 to-amber-400 font-medium bg-gradient-to-r text-3xl text-transparent justify-self-start bg-clip-text">
          Arquivos
        </span>
      </div>

      <div className="grid relative text-one w-10/12 grid-cols-1 h-screen -mb-28 grid-rows-1 gap-3">
        <div className="border-b-8 p-2 border-border w-full h-6/7 rounded-4xl flex flex-col bg-[#f5f5f5]">
          <div className="w-full h-full bg-back rounded-3xl border-3 border-border">
            <div className="h-full w-full flex justify-center items-center">
              <DataGrid
                
                rows={rows}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                // ✅ toolbar oficial
                showToolbar
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 1000 },
                  },
                }}
                sx={{
                  paddingX: 1,
                  backgroundColor: "transparent",
                  transition: 10,
                  justifyContent: "center",
                  borderRadius: 10,
                  border: "none",

                  "& .MuiDataGrid-row": {
                    backgroundColor: "white",
                    marginTop: 1,
                    
                    borderRadius: 4,
                    borderColor: "transparent",
                    borderBottom: 5,
                    borderBottomColor: "#D2D2D2",
                    
                  },

                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "white",
                    borderColor: "transparent",
                    borderBottom: 5,
                    borderBottomColor: "#D2D2D9",
                  },

                  "& .MuiDataGrid-container--top, .MuiDataGrid-columnHeaders, .MuiDataGrid-columnHeader": {
                    borderRadius: 0,
                    backgroundColor: "#F5F5F5",
                  },

                  "& .css-1oy5xf-MuiDataGrid-root":{
                    backgroundColor: "#F5F5F5",  
                  },

                  "& .MuiDataGrid-row--borderBottom":{
                    borderColor: "#F5F5F5",
                  },

                  "& .MuiDataGrid-toolbar": {
                    backgroundColor: "#F5F5F5",
                    position: "absolute",
                    borderColor: "transparent",
                    right: 0,
                    zIndex: 10,
                    p: 0.5,
                  },
                }}
              />
            </div>

            {/* Dialog com preview grande + inputs */}
            <MuiDialog open={open} onClose={() => setOpen(false)} maxWidth="xl" className="rounded-4xl" fullWidth>
              <MuiDialogTitle className="font-semibold">Validar registro</MuiDialogTitle>
              <MuiDialogContent>
                <MuiBox
                  sx={{ display: "grid", gridTemplateColumns: { xs: "2fr", md: "2fr 1fr 2fr" }, gap: 2, mt: 1 }}
                >
                  <div className="rounded-xl overflow-hidden border border-zinc-200">
                    {currentRow?.foto ? (
                      <img
                        src={dropboxToRaw(currentRow.foto)}
                        alt="Foto do checklist"
                        className="w-full h-[360px] object-contain bg-zinc-50"
                      />
                    ) : (
                      <div className="h-[360px] flex items-center justify-center text-zinc-500">Sem imagem</div>
                    )}
                  </div>
                  <div className="space-y-3 flex flex-col gap-3">
                    <MuiTextField
                      label="Patrimônio"
                      value={fPatrimonio}
                      onChange={(e) => setFPatrimonio(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <MuiTextField
                      label="Checklist"
                      value={fChecklist}
                      onChange={(e) => setFChecklist(e.target.value)}
                      fullWidth
                      size="medium"
                    />
                    <MuiTextField
                      label="Filial"
                      value={fFilial}
                      onChange={(e) => setFFilial(e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="Ex: MG"
                    />
                  </div>
                  <iframe
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: "20px" }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key==Tecnogera`}
                  ></iframe>
                </MuiBox>
              </MuiDialogContent>
              <MuiDialogActions>
                <MuiButton onClick={() => setOpen(false)}>Cancelar</MuiButton>
                <MuiButton variant="contained" onClick={handleSave}>
                  Salvar
                </MuiButton>
              </MuiDialogActions>
            </MuiDialog>
            {/* Dialog de HISTÓRICO por patrimônio */}
            <MuiDialog
              open={historyOpen}
              onClose={() => setHistoryOpen(false)}
              maxWidth="md"
              fullWidth
            >
                <MuiDialogTitle className="font-semibold">
                  Histórico {historyTarget ? `— Patrimônio ${historyTarget}` : ""}
                </MuiDialogTitle>

                <MuiDialogContent dividers>
                  {!historyTarget && (
                    <div className="text-sm text-zinc-600">
                      Esta linha não possui <strong>patrimônio</strong> preenchido. Preencha primeiro para consultar o histórico.
                    </div>
                  )}

                  {historyTarget && (
                    <>
                      {historyLoading && (
                        <div className="py-6 text-zinc-600">Carregando histórico…</div>
                      )}

                      {!historyLoading && historyItems.length === 0 && (
                        <div className="py-6 text-zinc-600">
                          Nenhum registro encontrado com patrimônio <strong>{historyTarget}</strong>.
                        </div>
                      )}

                      {!historyLoading && historyItems.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {historyItems.map((it) => (
                            <div
                              key={it.id}
                              className="rounded-xl border border-zinc-200 overflow-hidden bg-white"
                            >
                              <div className="w-full h-44 bg-zinc-50 flex items-center justify-center">
                                {it.foto ? (
                                  <a
                                    href={dropboxToRaw(it.foto)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full"
                                    title="Abrir imagem em nova aba"
                                  >
                                    <img
                                      src={dropboxToRaw(it.foto)}
                                      alt="Foto"
                                      className="w-full h-full object-contain"
                                    />
                                  </a>
                                ) : (
                                  <span className="text-zinc-500 text-sm">Sem imagem</span>
                                )}
                              </div>

                              <div className="p-3 space-y-1 text-sm">
                                <div className="flex gap-2 items-center">
                                  <span className="font-semibold">Patrimônio:</span>
                                  <span>{it.patrimonio || "-"}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="font-semibold">Checklist:</span>
                                  <span>{it.checklist || "-"}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="font-semibold">Filial:</span>
                                  <span>{it.filial || "-"}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="font-semibold">Data:</span>
                                  <span>{it.data || "-"}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </MuiDialogContent>

                <MuiDialogActions>
                  <MuiButton onClick={() => setHistoryOpen(false)}>Fechar</MuiButton>
                </MuiDialogActions>
              </MuiDialog>
          </div>
        </div>
      </div>
    </section>
  );
}
