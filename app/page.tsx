import Image from "next/image";
import Sidebar from "./components/nav";
import Page1 from "../app/dash/page";
import "./globals.css";
import { LucideArrowBigDownDash } from "lucide-react";
import Login from "./login/page";


export default function Home() {
  return (
    <div className="">
      <Login/>
    </div>
  );
}
