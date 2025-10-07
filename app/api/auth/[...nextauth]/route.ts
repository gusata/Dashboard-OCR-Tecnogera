import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

// (temporário) log e validação para ver o que está chegando
const { AZURE_AD_CLIENT_ID, AZURE_AD_TENANT_ID } = process.env;
console.log("[Auth Env] CLIENT_ID =", AZURE_AD_CLIENT_ID);
console.log("[Auth Env] TENANT_ID =", AZURE_AD_TENANT_ID);

const isGuid = (s?: string) => !!s && /^[0-9a-fA-F-]{36}$/.test(s);

if (!isGuid(AZURE_AD_CLIENT_ID)) {
  console.error("ERRO: AZURE_AD_CLIENT_ID não é GUID válido:", AZURE_AD_CLIENT_ID);
}
if (!isGuid(AZURE_AD_TENANT_ID)) {
  console.error("AVISO: AZURE_AD_TENANT_ID não parece GUID:", AZURE_AD_TENANT_ID);
}

const handler = NextAuth({
  debug: true,
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,       // tem que ser GUID
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,       // GUID do tenant (ou "common" se quiser multi-tenant)
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

// ⚠️ NÃO coloque `export const runtime = 'edge'` neste arquivo.
