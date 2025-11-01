import { useGSAP } from "@gsap/react";
import { Sidebar } from "../Components/Sidebar";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Home = () => {

    useGSAP(() => {
        gsap.from('.card', {
            x: -200,
            duration: 1.5,
            opacity: 0,
            ease: 'expo.inOut',
            scrollTrigger: {
                trigger: ".card",
                // markers:true,
                start: "top 50%",
                end: "300% 0%",
                scrub: 1,
            },
            stagger: 2,
        })
    })

    return (<>
        <Sidebar showDesktop={false} />

        <section className="relative w-full h-[85vh] z-10 p-4 pl-20 pr-20 ">
            <div className="w-full h-full flex flex-col gap-3 p-6 mt-13 justify-center">

                <div className="w-full h-1/4 flex justify-start items-end gap-2">
                    <h1 className="text-6xl text-black font-black">Plan Smarter. Manage Better.<span className="text-transparent bg-gradient-to-br bg-clip-text from-blue-400 to-blue-700"> Achieve</span> More.</h1>
                </div>

                <div className="w-full h-3/4 gap-6 flex flex-col justify-start items-start text-start pt-4">
                    <h1 className="w-3/5 text-xl text-zinc-600">your intelligent scheduling assistant that helps you organize classes effortlessly. Say goodbye to confusing spreadsheets and hello to automated, smart time management.</h1>
                    <button className="w-35 px-2 py-1 text-2xl font-bold bg-gradient-to-br  from-blue-300 to-blue-600 text-white  rounded-lg cursor-pointer border border-l-4 border-b-4 border-gray-900">Explore</button>
                </div>

                {/* <div className="w-full h-full flex justify-center items-start ">
                    
                </div> */}
            </div>
        </section>

        <section className="relative z-10 w-full min-h-screen p-4 pl-20 pr-20 ">
            <div className="w-full h-full flex flex-col gap-3 ">
                <h1 className="text-5xl text-black font-bold">How it Works</h1>
                <div className="cardContainer w-full h-full flex flex-col gap-5 p-2">

                    <div className="card w-full h-60 flex gap-5 rounded-lg">
                        <div className="w-1/2 h-full rounded-lg p-1">
                            <img className="w-full h-full object-cover rounded-lg" src="/images/add_dept_img.png" alt="" />
                        </div>
                        <div className="w-1/2 h-full flex flex-col gap-3 p-2 pl-5">
                            <h1 className="text-transparent bg-gradient-to-br bg-clip-text from-blue-400 to-blue-700 text-2xl font-black">Step 1:- Add New Department </h1>
                            <ol className="list-decimal flex flex-col gap-2 text-lg text-zinc-600 pl-5">
                                <li>Click on "Add" button.</li>
                                <li>Enter Department Name.</li>
                                <li>Enter "Unique" Department Code.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="card w-full h-60 flex gap-5 rounded-lg">
                        <div className="w-1/2 h-full rounded-lg p-1">
                            <img className="w-full h-full object-cover rounded-lg" src="/images/add_sub_img.png" alt="" />
                        </div>
                        <div className="w-1/2 h-full flex flex-col gap-3 p-2 pl-5">
                            <h1 className="text-transparent bg-gradient-to-br bg-clip-text from-blue-400 to-blue-700 text-2xl font-black">Step 2:- Add New Subject </h1>
                            <ol className="list-decimal flex flex-col gap-2 text-lg text-zinc-600 pl-5">
                                <li>Click on "Add" button.</li>
                                <li>Enter Subject Name & Code.</li>
                                <li>Enter Required Weekly Hours & Batch Size per Section.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="card w-full h-60 flex gap-5 rounded-lg">
                        <div className="w-1/2 h-full rounded-lg p-1">
                            <img className="w-full h-full object-cover rounded-lg" src="/images/add_room_img.png" alt="" />
                        </div>
                        <div className="w-1/2 h-full flex flex-col gap-3 p-2 pl-5">
                            <h1 className="text-transparent bg-gradient-to-br bg-clip-text from-blue-400 to-blue-700 text-2xl font-black">Step 1:- Add New Room </h1>
                            <ol className="list-decimal flex flex-col gap-2 text-lg text-zinc-600 pl-5">
                                <li>Click on "Add" button.</li>
                                <li>Enter Room No.</li>
                                <li>Enter Capcity Per Section.</li>
                                <li>Select Room Type.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="card w-full h-60 flex gap-5 rounded-lg">
                        <div className="w-1/2 h-full rounded-lg p-1">
                            <img className="w-full h-full object-cover rounded-lg" src="/images/add_faculty_img.png" alt="" />
                        </div>
                        <div className="w-1/2 h-full flex flex-col gap-3 p-2 pl-5">
                            <h1 className="text-transparent bg-gradient-to-br bg-clip-text from-blue-400 to-blue-700 text-2xl font-black">Step 1:- Add New Faculty </h1>
                            <ol className="list-decimal flex flex-col gap-2 text-lg text-zinc-600 pl-5">
                                <li>Click on "Add" button.</li>
                                <li>Enter Employee ID & Name. </li>
                                <li>Enter Teaching Load per Week.</li>
                                <li>Select Department & Subjects.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="card w-full h-60 flex gap-5 rounded-lg">
                        <div className="w-1/2 h-full rounded-lg p-1">
                            <img className="w-full h-full object-cover rounded-lg" src="/images/add_section_img.png" alt="" />
                        </div>
                        <div className="w-1/2 h-full flex flex-col gap-3 p-2 pl-5">
                            <h1 className="text-transparent bg-gradient-to-br bg-clip-text from-blue-400 to-blue-700 text-2xl font-black">Step 1:- Add New Section </h1>
                            <ol className="list-decimal flex flex-col gap-2 text-lg text-zinc-600 pl-5">
                                <li>Click on "Add" button.</li>
                                <li>Enter Section Name.</li>
                                <li>Select Department & Year.</li>
                                <li>Select Subjects for Section.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </>)
}