export default function Page1() {
  return (
    <section className="min-h-screen relative justify-self-end w-10/12 gap-7 px-6 py-4">

        <div className="pb-5">
            <span className="text- from-amber-500 via-amber-500 to-amber-400 font-medium bg-gradient-to-r text-3xl text-transparent bg-clip-text">Dashboard</span>
        </div>

        <div className="grid grid-cols-3 grid-rows-3 gap-7">

            {/* 1ª linha */}
            <div className="col-span-2 border-b-8 p-2 border-[#D2D2D2] rounded-4xl h-96 bg-white" >
                <div className="pl-7     flex justify-start items-start">
                    <span className="m-2 font-semibold text-xl flex pt-3">Overview</span>
                </div>
                 <div className=" h-72  my-5 gap-2 grid grid-cols-2 border-3 border-[#D2D2D2] p-2.5 w-full rounded-3xl bg-[#EEEEEE]">
                    <div className="bg-white rounded-tr-[10rem] rounded-br-[10rem] rounded-bl-2xl rounded-tl-2xl "></div>
                    <div className=""></div>
                 </div>
            </div>
            <div className="rounded-4xl border-b-8 border-[#D2D2D2] bg-white row-span-2" />  

            {/* 2ª linha */}
            <div className="rounded-4xl border-b-8 border-[#D2D2D2] bg-white h-80" />

        </div>

    </section>
  );
}
