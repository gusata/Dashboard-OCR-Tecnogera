import Image from "next/image";
import Sidebar from "./components/nav";
import Page1 from "./components/page1";
import "./globals.css";


export default function Home() {
  return (
    <div className="">
      <Sidebar/>
      <Page1/>
    </div>
  );
}
