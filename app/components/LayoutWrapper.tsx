// app/components/LayoutWrapper.tsx
"use client"

import { usePathname } from "next/navigation"

import Sidebar from "./nav"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavbar = pathname === "/"

  return (
    <>
      {!hideNavbar && <Sidebar />}
      {children}
    </>
  )
}
