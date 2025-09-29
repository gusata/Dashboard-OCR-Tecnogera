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

// --- utils ---
const dropboxToRaw = (url: string) => {
  if (!url) return "";
  const base = url.replace(/([?&])(dl=\d|raw=1)/g, "").replace(/[?&]$/, "");
  return base + (base.includes("?") ? "&raw=1" : "?raw=1");
};


const isPend = (s?: string) => !!s && /^pend/i.test(s.trim());



export default function Arquivos() {

type Row = {
  id: string;
  backendId: string;   // <— novo: ID que o DRF espera
  foto: string;
  patrimonio?: string;
  checklist?: string;
  filial?: string;
};


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
        return <Pill tone={tone as any} className="w-24 truncate">{String(p.value ?? " ")}</Pill>;
      },
    },
    {
      field: "acao",
      headerName: "",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      flex: 0.6,
      renderCell: (p) => (
        <button
          onClick={() => handleOpen(p.row as Row)}
          className="bg-blue-600 h-8/12 w-24 flex justify-center mt-1.5 items-center self-center rounded-lg text-white border-2"
        >
          Validar
        </button>
      ),
    },
  ];


  return (
    <section className="flex flex-col justify-start items-start overflow-y-hidden pl-3" id="arquivos">
      <div className="pb-5">
        <span className="from-amber-500 via-amber-500 to-amber-400 font-medium bg-gradient-to-r text-3xl text-transparent bg-clip-text">
          Arquivos
        </span>
      </div>

      <div className="grid relative text-one w-full grid-cols-1 h-screen -mb-28 grid-rows-1 gap-3">
        <div className="border-b-8 p-2 border-border w-full h-6/7 rounded-4xl flex flex-col bg-white">
          <div className="w-full h-full bg-back rounded-3xl border-3 border-border">
            <div className="h-full w-full flex justify-center items-center">
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                // ✅ toolbar oficial
                slots={{ toolbar: GridToolbar }}
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
                    borderRadius: 4,
                    borderColor: "transparent",
                    borderBottom: 5,
                    borderBottomColor: "#D2D2D9",
                  },

                  "& .MuiDataGrid-container--top, .MuiDataGrid-columnHeaders, .MuiDataGrid-columnHeader": {
                    borderColor: "transparent",
                    borderRadius: 3,
                    backgroundColor: "transparent",
                    border: "none",
                  },
                  "& .MuiDataGrid-toolbarContainer": {
                    backgroundColor: "#EEEEEE",
                    position: "absolute",
                    right: 0,
                    zIndex: 10,
                    borderRadius: 6,
                    m: 1,
                    p: 0.5,
                  },
                }}
              />
            </div>

            {/* Dialog com preview grande + inputs */}
            <MuiDialog open={open} onClose={() => setOpen(false)} maxWidth="md" className="rounded-4xl" fullWidth>
              <MuiDialogTitle className="font-semibold">Validar registro</MuiDialogTitle>
              <MuiDialogContent>
                <MuiBox
                  sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: 2, mt: 1 }}
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
                      size="small"
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
                </MuiBox>
              </MuiDialogContent>
              <MuiDialogActions>
                <MuiButton onClick={() => setOpen(false)}>Cancelar</MuiButton>
                <MuiButton variant="contained" onClick={handleSave}>
                  Salvar
                </MuiButton>
              </MuiDialogActions>
            </MuiDialog>
          </div>
        </div>
      </div>
    </section>
  );
}
