import { ArrowDown, ArrowUp, File } from "lucide-react";

export default function Page1() {
  return (
    <section className="min-h-screen relative justify-self-end text-one w-10/12 gap-7 px-6 py-4">

        <div className="pb-5">
            <span className="text- from-amber-500 via-amber-500 to-amber-400 font-medium bg-gradient-to-r text-3xl text-transparent bg-clip-text">Dashboard</span>
        </div>

        <div className="grid text-one grid-cols-2 grid-rows-2 gap-7">

            {/* 1ª linha */}
            <div className="col-span-2 border-b-8 p-2 border-border rounded-4xl h-96 bg-white" >
                <div className="pl-7 flex justify-start items-start">
                    <span className="m-2 font-semibold text-xl flex pt-3">Overview</span>
                </div>
                <div className=" justify-between h-72 my-4 grid grid-cols-2 border-3 border-[#D2D2D2] p-2.5 w-full rounded-3xl bg-[#EEEEEE]">
                   <div className="bg-white w-[120%] rounded-tr-[10rem] flex justify-center pl-10 rounded-br-[10rem] rounded-bl-2xl flex-col rounded-tl-2xl">
                       <div className="flex justify-start items-start text-xl font-semibold w-8/10">
                           <span className="flex gap-2"> <File className="size-7"/> Arquivos Lidos <span className="text-sm self-center text-one/70 flex">hoje</span></span>
                       </div>
                       <div className="w-8/10 grid grid-cols-2 gap-1 grid-rows-2 h-5/10">
                           <div className="justify-center flex items-end pb-5 row-span-2">
                               <span className="text-8xl font-bold">54</span>
                           </div>
                           <div className="flex items-end">
                               <span className="bg-green-300 py-1 px-3 rounded-2xl border-3 text-green-800 border-green-800 font-semibold flex gap-2"> <ArrowUp className="text-green-800"/> 13%</span>
                           </div>
                           <div className="text-one/70 font-semibold w-20 flex justify-start">
                               <span className="leading-4">A mais que ontem</span>
                           </div>
                       </div>
                   </div>
                   <div className=" w-7/9 items-center justify-self-end flex flex-col justify-center">
                        <div className="flex justify-start items-start text-xl font-semibold w-9/10">
                           <span className="flex gap-2"> <File className="size-7"/> Arquivos Lidos <span className="text-sm self-center text-one/70 flex">essa semana</span></span>
                       </div>
                        <div className="w-8/10 grid grid-cols-2 gap-x-16 gap-y-1 grid-rows-2 h-5/10">
                           <div className="justify-center flex items-end pb-5 row-span-2">
                               <span className="text-8xl pl-4 font-bold">130</span>
                           </div>
                           <div className="flex items-end">
                               <span className="bg-red-300 py-1 px-3 rounded-2xl border-3 text-red-800 border-red-800 font-semibold flex gap-2"> <ArrowDown className="text-red-800"/> 26%</span>
                           </div>
                           <div className="text-one/70 font-semibold w-20 flex justify-start">
                               <span className="leading-4">A menos que ontem</span>
                           </div>
                       </div>
                   </div>

                </div>
            </div>


            {/* 2ª linha */}
            <div className="rounded-4xl border-b-8 border-border bg-white h-80" />

        </div>

    </section>
  );
}
