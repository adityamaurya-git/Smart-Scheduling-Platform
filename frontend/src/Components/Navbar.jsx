import { Link, NavLink } from "react-router-dom"

export const Navbar = () => {
    return(<>
        <nav className="w-full h-20 p-3 flex justify-center items-center text-white">
            <div className="containerDiv w-3/4 h-full flex justify-between items-center rounded-4xl font-mono overflow-hidden bg-[#1D1D1D]">
                <div className="LogoDiv w-1/5 h-full flex justify-center items-center  ">
                    <h1 className=" text-2xl font-semibold">STM</h1>
                </div>
                <div className="LinksDiv w-full h-full flex gap-2 justify-center items-center ">
                    <NavLink className={(e) => `px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-200 text-black font-semibold" : "text-zinc-200"}`} to="/">Home</NavLink>
                    <NavLink className={(e) => `px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-200 text-black font-semibold" : "text-zinc-200"}`} to="/admin/dashboard">Dashboard</NavLink>
                    <NavLink className={(e) => `px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-200 text-black font-semibold" : "text-zinc-200"}`} to="/login">Login</NavLink>
                    <NavLink className={(e) => `px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-200 text-black font-semibold" : "text-zinc-200"}`} to="/register">Register</NavLink>
                </div>
                <div className="ProfileDiv w-1/5 h-full flex justify-end pr-3 items-center ">
                    <NavLink to="/admin/profile">
                        <div className="w-10 h-10 rounded-full bg-red-400"></div>
                    </NavLink>              
                </div>
            </div>
        </nav>
    </>)
}