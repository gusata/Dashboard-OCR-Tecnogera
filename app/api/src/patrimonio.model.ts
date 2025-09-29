import mongoose, { Schema } from "mongoose";

const PatrimonioSchema = new Schema(
  {
    cod_patrimonio: { type: String, default: null, index: true },
    data: { type: String, index: true },                 // "YYYY-MM-DD"
    checklist: { type: String, index: true },            // ex: "217088"
    localizacao: { type: String, default: "" },
    filial: { type: String, default: "" },
    dropbox_link: { type: String, default: "" },
    dropbox_path: { type: String, default: "" },
    arquivo: { type: String, default: "" },
    content_hash: { type: String, default: "" },
    client_modified: { type: Date },
    processado_em: { type: Date, index: true },
    criado_em: { type: Date, index: true },
    atualizado_em: { type: Date, index: true },
    ocr_raw: { type: String, default: "" },
    id: { type: Number, index: true }                    // se existir no payload
  },
  { collection: "patrimonios", timestamps: false }
);

// Índices úteis
PatrimonioSchema.index({ checklist: 1, data: -1 });
PatrimonioSchema.index({ cod_patrimonio: 1 });
PatrimonioSchema.index({ processado_em: -1 });

export type Patrimonio = mongoose.InferSchemaType<typeof PatrimonioSchema>;
export default mongoose.model("Patrimonio", PatrimonioSchema);
