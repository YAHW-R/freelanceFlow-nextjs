'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    ListTodo,
    Users,
    AreaChart,
    Bot,
    Settings,
    ChevronLeft,
    ChevronRight,
    Clock,
    Menu,
    X
} from 'lucide-react';

import IconApp from '@/app/components/icons/IconApp.svg';

// Navigation items structure
const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/projects', label: 'Proyectos', icon: FolderKanban },
    { href: '/dashboard/tasks', label: 'Tareas', icon: ListTodo },
    { href: '/dashboard/clients', label: 'Clientes', icon: Users },
    { href: '/dashboard/time-traker', label: 'Time Tracker', icon: Clock },
    { href: '/dashboard/metrics', label: 'Métricas', icon: AreaChart },
];

const secondaryNavItems = [
    { href: '/dashboard/ai-assistant', label: 'Asistente IA', icon: Bot },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Close mobile menu on path change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Disable body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const NavLinks = ({ isMobile = false }) => (
        <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-2 px-4">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center rounded-lg p-3 transition-colors duration-200 ${isActive
                                        ? 'bg-background text-foreground'
                                        : 'text-foreground-secondary hover:bg-background hover:text-foreground'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    {(!isCollapsed || isMobile) && (
                                        <span className="ml-4 font-medium">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="p-4 border-t border-background">
                <ul className="space-y-2">
                    {secondaryNavItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="flex items-center rounded-lg p-3 text-foreground-secondary transition-colors duration-200 hover:bg-background hover:text-foreground"
                            >
                                <item.icon size={20} />
                                {(!isCollapsed || isMobile) && (
                                    <span className="ml-4 font-medium">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className={`md:hidden fixed top-18 right-4 z-50 p-2 rounded-md bg-background-secondary text-foreground shadow-lg transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                aria-label="Open sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Sidebar (sliding) */}
            <div
                className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    onClick={toggleMobileMenu}
                    className="absolute inset-0 bg-black/60"
                    aria-hidden="true"
                ></div>

                {/* Sidebar Panel */}
                <nav
                    className={`relative flex h-full w-64 flex-col bg-background-secondary text-foreground shadow-xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="flex h-20 items-center justify-between px-6">
                        <Link href="/" className="flex items-center">
                            <IconApp size={32} className="text-primary" />
                            <span className="ml-3 text-xl font-bold">FreelanceFlow</span>
                        </Link>
                        <button onClick={toggleMobileMenu} className="text-foreground p-2 -mr-2" aria-label="Close sidebar">
                            <X size={24} />
                        </button>
                    </div>
                    <NavLinks isMobile={true} />
                </nav>
            </div>

            {/* Desktop Sidebar */}
            <nav
                className={`hidden md:relative md:flex h-screen flex-col bg-background-secondary text-foreground shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground hover:bg-primary focus:outline-none"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                <Link href="/" className="flex h-20 items-center px-6 cursor-pointer">
                    <IconApp size={32} className="text-primary" />
                    {!isCollapsed && (
                        <span className="ml-3 text-xl font-bold animate-fade-in hover:text-primary transition">FreelanceFlow</span>
                    )}
                </Link>

                <NavLinks />
            </nav>
        </>
    );
}
