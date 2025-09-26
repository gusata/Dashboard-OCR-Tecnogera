"use client"

import { LayoutDashboard, Home, Files, FileCheck2, Settings, LogOut } from "lucide-react"
import Image from 'next/image'               // ✅ default import
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

type Item = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const items: Item[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Arquivos", href: "/files", icon: Files },
  { title: "Configurações", href: "/settings", icon: Settings },
];

export default function Sidebar() {
const pathname = usePathname(); // ✅ agora existe

  return (
    <aside className="h-screen fixed w-64 bg-back text-one flex flex-col justify-between p-2.5 font-sunflower m-1">
      {/* Top Section */}
      <div>
        <div className="text-2xl font-bold items-center flex justify-center font-sunflower">
          <Image src={"/logo.png"} alt="logo" width={60} height={60}/>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  prefetch               // ✅ no Link, não no ícone
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition
                    ${active ? "bg-gray-300 font-semibold" : "hover:bg-gray-200"}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        </nav>
      </div>
      
    </aside>
  )
}
