'use client'; // Necesario para useState y Dropdown

import { useState } from 'react';
import Link from 'next/link';
import {
    Bell, // Icono de notificaciones
    Search, // Icono de búsqueda
    Plus, // Icono para "crear"
    User, // Icono de perfil genérico (si no hay avatar)
    LogOut, // Icono para cerrar sesión
    Settings, // Icono para configuración
    ChevronDown, // Icono para desplegables
} from 'lucide-react'; // Asegúrate de tener lucide-react instalado
import Image from 'next/image'; // Para un avatar de usuario real

export default function Topbar() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

    // Datos de ejemplo para el usuario y notificaciones
    const userName = 'John Doe';
    const userAvatar = '/avatars/john-doe.jpg'; // Ruta a tu imagen de avatar
    const unreadNotifications = 3;

    const notifications = [
        { id: 1, message: 'Tarea "Diseñar Login" completada.', time: 'hace 5 min' },
        { id: 2, message: 'Nuevo comentario en Proyecto Alpha.', time: 'hace 1 hora' },
        { id: 3, message: 'Factura #001 pendiente de pago.', time: 'hace 3 horas' },
    ];

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md animate-fade-in-down">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar proyectos, tareas, clientes..."
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
            </div>

            {/* Right Side - Actions and Profile */}
            <div className="ml-auto flex items-center space-x-4">
                {/* Quick Create Button */}
                <div className="relative">
                    <button
                        onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white transition-all duration-200 hover:scale-105 hover:bg-cyan-700 animate-subtle-pulse"
                        title="Crear nuevo..."
                    >
                        <Plus size={24} />
                    </button>
                    {isQuickCreateOpen && (
                        <div className="absolute right-0 top-12 z-20 w-48 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in">
                            <Link href="/dashboard/projects/new" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Nuevo Proyecto
                            </Link>
                            <Link href="/dashboard/tasks/new" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Nueva Tarea
                            </Link>
                            <Link href="/dashboard/clients/new" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Nuevo Cliente
                            </Link>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        title="Notificaciones"
                    >
                        <Bell size={24} />
                        {unreadNotifications > 0 && (
                            <span className="absolute -right-0 -top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-subtle-pulse">
                                {unreadNotifications}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-12 z-20 w-80 rounded-md bg-white p-3 shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in">
                            <h3 className="mb-2 text-sm font-semibold text-gray-800">Notificaciones</h3>
                            <ul className="space-y-2">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <li key={notif.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                                            <p className="text-sm text-gray-700">{notif.message}</p>
                                            <span className="text-xs text-gray-500">{notif.time}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-gray-500">No hay notificaciones nuevas.</li>
                                )}
                            </ul>
                            <Link href="/dashboard/settings?tab=notifications" className="mt-3 block text-center text-sm text-cyan-600 hover:underline">
                                Ver todas
                            </Link>
                        </div>
                    )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 transition-colors duration-200"
                        title="Perfil de usuario"
                    >
                        {userAvatar ? (
                            <Image
                                src={userAvatar}
                                alt={userName}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <User size={32} className="rounded-full bg-gray-200 p-1 text-gray-600" />
                        )}
                        <span className="hidden text-sm font-medium text-gray-700 md:block">{userName}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 top-12 z-20 w-48 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in">
                            <Link href="/dashboard/profile" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <User size={16} className="inline-block mr-2" /> Mi Perfil
                            </Link>
                            <Link href="/dashboard/settings" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Settings size={16} className="inline-block mr-2" /> Configuración
                            </Link>
                            <div className="my-1 border-t border-gray-100"></div>
                            <button className="flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
                                <LogOut size={16} className="inline-block mr-2" /> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}