'use client';

import { useState } from 'react';
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
    Clock
} from 'lucide-react';

import IconApp from '@/app/components/icons/IconApp.svg';


// Definimos la estructura de cada item de navegación
const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/projects', label: 'Proyectos', icon: FolderKanban },
    { href: '/dashboard/tasks', label: 'Tareas', icon: ListTodo },
    { href: '/dashboard/clients', label: 'Clientes', icon: Users },
    { href: '/dashboard/time-traker', label: 'Time Tracker', icon: Clock },
    { href: '/dashboard/metrics', label: 'Métricas', icon: AreaChart },
    //{ href: '/dashboard/invoices', label: 'Facturas', icon: FileText },
];

const secondaryNavItems = [
    { href: '/dashboard/ai-assistant', label: 'Asistente IA', icon: Bot },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <nav
            className={`relative flex h-screen flex-col bg-background-secondary text-foreground shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Botón para colapsar/expandir */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground hover:bg-primary focus:outline-none"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Logo y Título */}
            <Link
                href="/"
                className="flex h-20 items-center px-6 cursor-pointer">
                <IconApp size={32} className="text-primary" />
                {!isCollapsed && (
                    <span className="ml-3 text-xl font-bold animate-fade-in hover:text-primary transition">FreelanceFlow</span>
                )}
            </Link>

            {/* Navegación Principal */}
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-2 px-4">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center rounded-lg p-3 transition-colors duration-200
                    ${isActive
                                            ? 'bg-background text-foreground'
                                            : 'text-foreground-secondary hover:bg-background hover:text-foreground'
                                        }
                  `}
                                >
                                    <item.icon size={20} />
                                    {!isCollapsed && (
                                        <span className="ml-4 font-medium animate-fade-in-left">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Navegación Secundaria */}
            <div className="border-t border-background-secondary p-4">
                <ul className="space-y-2">
                    {secondaryNavItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="flex items-center rounded-lg p-3 text-foreground-secondary transition-colors duration-200 hover:bg-background hover:text-foreground"
                            >
                                <item.icon size={20} />
                                {!isCollapsed && (
                                    <span className="ml-4 font-medium animate-fade-in-left">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}