import { Footer } from "./Components/Footer"
import { Navbar } from "./Components/Navbar"
import { MainRoutes } from "./routes/MainRoutes"
import { UIProvider } from "./store/uiContext"


export const App = () => {

    return (<>
        <UIProvider>
            <div className="w-full h-full font-sans bg-[#E6F3FF]">
                <Navbar/>
                <MainRoutes/>
                <Footer/>
            </div>
        </UIProvider>
    </>)
}
