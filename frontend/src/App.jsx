import { Footer } from "./Components/Footer"
import { Navbar } from "./Components/Navbar"
import { MainRoutes } from "./routes/MainRoutes"
import { UIProvider } from "./store/uiContext"
import gsap  from "gsap";
import {useGSAP} from "@gsap/react"
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
gsap.registerPlugin(useGSAP)

export const App = () => {

    ScrollSmoother.create({
        smooth: 1,             // how long (in seconds) it takes to "catch up" to the native scroll position
        effects: true,            // looks for data-speed and data-lag attributes on elements
        smoothTouch: 0.1,        // much shorter smoothing time on touch devices (default is 0.1)
    })

    return (<>
        <div id="smooth-wrapper">
            <div id="smooth-content">
                <UIProvider>
                    <main className=" w-full h-full font-sans bg-[#E6F3FF]">
                        <section className="relative flex flex-col items-center justify-center overflow-hidden">
                            <div className="fixed inset-0 z-0">
                                <div className="box absolute inset-0 z-0 w-full h-full"></div>
                            </div>
                            {/* <div className="line fixed inset-x-0 z-50 h-px origin-left bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 top-0 "></div> */}
                            <div className="fixed inset-0 bg-gradient-to-bl  from-blue-300/50 via-white to-blue-300/30 "></div>
                        </section>
                        <Navbar />
                        <MainRoutes />
                        <Footer />
                    </main>
                </UIProvider>
            </div>
        </div>

    </>)
}
