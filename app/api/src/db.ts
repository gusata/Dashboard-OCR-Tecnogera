import mongoose from "mongoose";

export async function connectDB(uri: string) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    autoIndex: true
  } as any);
  console.log("[mongo] conectado");
}
