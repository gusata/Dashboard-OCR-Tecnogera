"use client"

import { LayoutDashboard, Home, FileText, Users, Settings, LogOut } from "lucide-react"
import Image from 'next/image'

const items = [
  { title: "Dashboard", icon: LayoutDashboard, url: "#" },
  { title: "Home", icon: Home, url: "#" },
  { title: "Documents", icon: FileText, url: "#" },
  { title: "Users", icon: Users, url: "#" },
  { title: "Settings", icon: Settings, url: "#" },
]

export default function Sidebar() {
  return (
    <aside className="h-screen fixed w-64 bg-back text-one flex flex-col justify-between font-sunflower m-1">
      {/* Top Section */}
      <div>
        <div className="text-2xl font-bold items-center flex justify-center font-sunflower">
          <Image src={"/logo.png"} alt="logo" width={60} height={60}/>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.title}>
                <a
                  href={item.url}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-300 rounded-full transition-all"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
    </aside>
  )
}
