import { NavLink } from "react-router-dom"
import { useUI } from "../store/uiContext"
import { useSelector } from "react-redux";

export const Sidebar = ({ showDesktop = true }) => {
    const { sidebarOpen, setSidebarOpen } = useUI();
    const {isAuthenticated} = useSelector((state) => state.user);

    const linkCls = (e) => `text-base md:text-lg font-semibold px-2 py-1 rounded-lg ${e.isActive ? "bg-zinc-100" : "bg-none"}`;

    const NavItems = ({ onNavigate, includeTopLinks = true }) => (
        <nav className="w-full h-full flex flex-col gap-3">
            {includeTopLinks && (
                <>
                    {/* Top: Navbar links (mobile drawer only) */}
                    <div className="w-full flex flex-col p-2 gap-2">
                        {isAuthenticated ? (<>
                            <NavLink onClick={onNavigate} className={linkCls} to="/">Home</NavLink>
                        </>) : (<>
                            <NavLink onClick={onNavigate} className={linkCls} to="/login">Login</NavLink>
                            <NavLink onClick={onNavigate} className={linkCls} to="/register">Register</NavLink>
                        </>)}
                    </div>
                    <div className="h-[1px] w-full bg-white/40" />
                </>
            )}
            {/* App sections */}
            <div className="w-full flex flex-col p-2 gap-2">
                {isAuthenticated && <>  
                    <NavLink onClick={onNavigate} className={linkCls} to="/admin/dashboard">Dashboard</NavLink>
                    <NavLink onClick={onNavigate} className={linkCls} to="/generate/timetable">Generate Timetable</NavLink>
                    <NavLink onClick={onNavigate} className={linkCls} to="/manage/departments">Manage Departments</NavLink>
                    <NavLink onClick={onNavigate} className={linkCls} to="/manage/subjects">Manage Subjects</NavLink>
                    <NavLink onClick={onNavigate} className={linkCls} to="/manage/rooms">Manage Rooms</NavLink>
                    <NavLink onClick={onNavigate} className={linkCls} to="/manage/faculties">Manage Faculties</NavLink>
                    <NavLink onClick={onNavigate} className={linkCls} to="/manage/sections">Manage Sections</NavLink>
                </>}
            </div>
        </nav>
    );

    return (
        <>
            {/* Mobile Sidebar toggle removed per request; use Navbar hamburger to open the drawer. */}

            {/* Desktop sidebar */}
            {showDesktop && (
                <aside className="hidden md:block md:w-1/4 h-[87vh] md:p-2">
                    <div className="w-full h-full rounded-lg p-1 bg-[#89B0FF]">
                        <NavItems onNavigate={undefined} includeTopLinks={false} />
                    </div>
                </aside>
            )}

            {/* Mobile drawer */}
            {sidebarOpen && (
                <div className="md:hidden">
                    <div className="fixed inset-0 z-[55] bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed left-0 top-0 z-[60] h-full w-72 max-w-[85vw] bg-[#89B0FF] shadow-xl">
                        <div className="flex items-center justify-between p-3">
                            <span className="font-semibold">Menu</span>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border bg-white/90 px-2 py-1 text-sm font-medium shadow-sm"
                                onClick={() => setSidebarOpen(false)}
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="h-[1px] w-full bg-white/40" />
                        <div className="overflow-y-auto">
                            <NavItems onNavigate={() => setSidebarOpen(false)} includeTopLinks={true} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}





{/* <div className=" flex h-screen border">
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <nav className="flex-grow">
            <Link to="/" className="block py-2.5 px-4 rounded hover:bg-gray-700">Dashboard</Link>
            <Link to="/generate" className="block py-2.5 px-4 rounded hover:bg-gray-700">Generate Timetable</Link>
            <h2 className="text-xs font-semibold text-gray-400 mt-6 mb-2 px-4">MANAGE</h2>
            <Link to="/manage-departments" className="block py-2.5 px-4 rounded hover:bg-gray-700">Departments</Link>
            <Link to="/manage-subjects" className="block py-2.5 px-4 rounded hover:bg-gray-700">Subjects</Link>
            <Link to="/manage-rooms" className="block py-2.5 px-4 rounded hover:bg-gray-700">Rooms</Link>
            <Link to="/manage-faculties" className="block py-2.5 px-4 rounded hover:bg-gray-700">Faculties</Link>
            <Link to="/manage-sections" className="block py-2.5 px-4 rounded hover:bg-gray-700">Sections</Link>
        </nav>
    </aside>
    <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
    </main>
</div> */}