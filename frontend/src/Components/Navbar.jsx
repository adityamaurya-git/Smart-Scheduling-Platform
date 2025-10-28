import { Link, NavLink, useNavigate } from "react-router-dom"
import { useUI } from "../store/uiContext"
import { useSelector } from "react-redux";
import { api } from "../services/api";

export const Navbar = () => {
    const { setSidebarOpen } = useUI()
    const navigate = useNavigate();
    const {isAuthenticated} = useSelector((state) => state.user);

    const adminLogout = async () => {
        await api.post('/auth/admin/logout');
        navigate('/');
        window.location.reload();
    }

    const linkClass = (e) => `px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-200 text-black font-semibold" : "text-zinc-200"}`

    return (
        <nav className="w-full sticky top-0 z-50 border border-transparent text-white">
            {/* Top bar */}
            <div className="mx-auto w-[92vw] max-w-7xl h-16 md:h-18 mt-2 flex items-center justify-between rounded-2xl font-mono bg-[#1D1D1D] px-3 sm:px-4">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="text-2xl font-semibold leading-none">STM</div>
                    </Link>
                </div>

                {/* Center: Links (desktop) */}
                <div className="hidden md:flex items-center justify-center gap-2">
                    <NavLink className={linkClass} to="/">Home</NavLink>
                    {isAuthenticated ? (<>
                        <NavLink className={linkClass} to="/admin/dashboard">Dashboard</NavLink>
                    </>) : (<>
                        <NavLink className={linkClass} to="/login">Login</NavLink>
                        <NavLink className={linkClass} to="/register">Register</NavLink>
                    </>) }
                </div>

                {/* Right: Profile + Hamburger */}
                <div className="flex items-center gap-2">
                    {isAuthenticated && <>
                        {/* <NavLink to="/admin/profile" className=""> */}
                            <div onClick={adminLogout} className="hidden sm:block w-9 h-9 rounded-full bg-red-400 cursor-pointer"></div>
                        {/* </NavLink> */}
                    </>}
                    <button
                        type="button"
                        aria-label="Toggle menu"
                        aria-expanded={false}
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                    </button>
                </div>
            </div>

        </nav>
    )
}