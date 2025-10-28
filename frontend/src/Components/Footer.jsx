import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
    const year = new Date().getFullYear();

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Generate', to: '/generate/timetable' },
        { label: 'Departments', to: '/manage/departments' },
        { label: 'Subjects', to: '/manage/subjects' },
        { label: 'Rooms', to: '/manage/rooms' },
        { label: 'Faculties', to: '/manage/faculties' },
        { label: 'Sections', to: '/manage/sections' },
    ];

    return (
        <footer className="w-full border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            {/* Accent line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-[#89B0FF] via-[#a6c2ff] to-[#89B0FF]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Top row */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-[#89B0FF] to-blue-500 shadow-sm" />
                        <div>
                            <p className="text-sm uppercase tracking-widest text-gray-500">Smart Scheduling</p>
                            <p className="font-semibold text-gray-900">Platform</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                        {navLinks.map((l) => (
                            <Link key={l.to} to={l.to} className="hover:text-gray-900 transition-colors">
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Socials */}
                    <div className="flex items-center gap-3">
                        <a
                            href="#"
                            aria-label="GitHub"
                            className="p-2 rounded-md border hover:bg-gray-50 text-gray-700 transition-colors"
                            rel="noreferrer"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            aria-label="LinkedIn"
                            className="p-2 rounded-md border hover:bg-gray-50 text-gray-700 transition-colors"
                            rel="noreferrer"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            aria-label="Email"
                            className="p-2 rounded-md border hover:bg-gray-50 text-gray-700 transition-colors"
                            rel="noreferrer"
                        >
                            <Mail className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-6 border-t" />

                {/* Bottom row */}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                    <p>© {year} Smart Scheduling Platform. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};