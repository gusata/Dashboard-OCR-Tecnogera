"use client"

import Image from 'next/image'  
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { signIn } from "next-auth/react";
import Stars from "./stars"
import "./page.scss"

export default function Login() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  


async function handleSSO() {
    try {
      setLoading(true);
      // opcional: ajuste o callbackUrl para onde seu app deve ir após login
      await signIn("azure-ad", { callbackUrl: "/dash" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-svh w-screen overflow-hidden bg-neutral-900 text-white">
      {/* Decorative background */}
      <Stars />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80rem_40rem_at_80%_-20%,#fb923c20,transparent),radial-gradient(60rem_30rem_at_10%_110%,#fb923c26,transparent)]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Content */}
      <div className="mx-auto grid min-h-svh max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left / Brand panel */}
        <div className="relative hidden items-center justify-center p-8 lg:flex">
          <div className="relative isolate">
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-transparent " >
                    <Image src={"/logo.png"} alt="logo" width={60} height={60}/>
              </div>
              <div>
                
                <p className="text-sm tracking-widest text-orange-400/90">TECNOGERA</p>
                <h1 className="text-3xl font-semibold leading-tight">Plataforma Operacional</h1>
              </div>
            </div>
            <p className="max-w-md text-white/70">
              Acesse o painel para gerenciar checklists, patrimônios e operações da Tecnogera. Segurança, desempenho e
              controle — tudo em um só lugar.
            </p>
          </div>
        </div>

        {/* Right / Form panel */}
        {/* Right / Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 h-11 w-11 rounded-xl bg-orange-500/90 ring-1 ring-white/20" />
            <h1 className="text-2xl font-semibold">Tecnogera</h1>
            <p className="text-sm text-white/70">Faça login para continuar</p>
          </div>

          {/* Cartão do SSO */}
          <div className="space-y-4 grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <label htmlFor="email" className="text-sm text-white/80">
                E-mail corporativo
              </label>

            {/* Botão SSO Microsoft */}
            <button
              type="button"
              onClick={handleSSO}
              disabled={loading}
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white font-medium text-neutral-900 transition hover:bg-gray-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-80"
            >
              {/* Logotipo MS em SVG simples */}
              <span aria-hidden className="inline-flex">
                <svg width="16" height="16" viewBox="0 0 23 23">
                  <rect width="10" height="10" x="0" y="0" />
                  <rect width="10" height="10" x="12.5" y="0" />
                  <rect width="10" height="10" x="0" y="12.5" />
                  <rect width="10" height="10" x="12.5" y="12.5" />
                </svg>
              </span>
              {loading ? "Conectando à Microsoft..." : "Entrar com Microsoft"}
            </button>

        
            <div className="pt-2 text-center text-xs text-white/60">
              © {new Date().getFullYear()} Tecnogera — todos os direitos reservados
            </div>
          </div>

          {/* Secondary actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
            <span>Ambiente seguro</span>
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> SLA operacional
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
