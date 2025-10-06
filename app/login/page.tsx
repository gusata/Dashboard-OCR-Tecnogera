import "./page.scss"
import Stars from "./stars"

export default function Login(){
    return(
        <section className="bg-neutral-800 overflow-x-hidden p-2 h-screen w-screen z-20">
            <Stars/>
            <div className="bg-orange-400 rounded-2xl  w-full h-full flex justify-center items-center">
                <div className="absolute">
                    <div className="flex w-90 h-90 justify-center items-center relative">
                        <div className=" w-96 h-96 shadow-sm border-b border-b-white shadow-white backdrop-blur-xs z-10 bg-gray-800/10 rounded-2xl absolute " />

                    </div>
                </div>
                <div className="z-20 grid">
                    <div>BEM VINDO</div>
                    <div>
                        <textarea name="wed" id="wde">wed</textarea>
                    </div>
                </div>
            </div>
        </section>
    )
}