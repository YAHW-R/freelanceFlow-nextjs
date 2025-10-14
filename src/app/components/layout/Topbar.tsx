'use client'; // Necesario para useState y Dropdown

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Bell, // Icono de notificaciones
    Search, // Icono de búsqueda
    Plus, // Icono para "crear"
    User, // Icono de perfil genérico (si no hay avatar)
    FolderKanban, // Icono para proyectos
    ClipboardCheck, // Icono para tareas
    Building2, // Icono para clientes
    LogOut, // Icono para cerrar sesión
    Settings, // Icono para configuración
    ChevronDown, // Icono para desplegables
} from 'lucide-react'; // Asegúrate de tener lucide-react instalado

import { getUserProfile } from '@/app/actions/profileActions';
import { signOut } from '@/app/actions/authActions';
import { getTasksUser } from '@/app/actions/taskActions';
import { getProjects } from '@/app/actions/projectsActions';
import { getClients } from '@/app/actions/clientActions';

import { Profile, TaskWithProjectName, Project, Client } from '../../../lib/types';

import Image from 'next/image';

export default function Topbar() {

    // State para manejar la visibilidad de los menús desplegables
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);


    //userData state
    const [userData, setUserData] = useState<Profile>({
        id: "",
        username: "Freelancer",
        full_name: "",
        avatar_url: "",
        bio: "",
        skills: [],
        email: "",
        created_at: Date.now().toString()
    });

    const [tasks, setTasks] = useState<TaskWithProjectName[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchData[]>([]);

    // Tipo unificado para los datos de búsqueda
    interface SearchData {
        id: string;
        name: string;
        type: 'project' | 'task' | 'client';
    }


    useEffect(() => {
        // Fetch user profile data when the component mounts
        const fetchUserData = async () => {
            const profile = await getUserProfile();
            if (profile) setUserData(profile);
        };

        // Carga todos los datos necesarios para la búsqueda en paralelo
        const fetchAllData = async () => {
            const [fetchedProjects, fetchedClients, fetchedTasks] = await Promise.all([
                getProjects(),
                getClients(),
                getTasksUser()
            ]);
            setProjects(fetchedProjects || []);
            setClients(fetchedClients || []);
            setTasks(fetchedTasks || []);
        };

        fetchUserData();
        fetchAllData();
    }, []);

    // Maneja el cambio en el input de búsqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setIsSearchOpen(false);
            setSearchResults([]);
            return;
        }

        setIsSearchOpen(true);

        // Prepara los datos para la búsqueda
        const projectSearchData: SearchData[] = projects.map(p => ({ id: p.id, name: p.name, type: 'project' }));
        const clientSearchData: SearchData[] = clients.map(c => ({ id: c.id, name: c.name, type: 'client' }));
        const taskSearchData: SearchData[] = tasks.map(t => ({ id: t.id, name: t.title, type: 'task' }));

        const allData: SearchData[] = [...projectSearchData, ...clientSearchData, ...taskSearchData];

        // Filtra los datos
        const lowercasedQuery = query.toLowerCase();
        const filtered = allData.filter(item => item.name.toLowerCase().includes(lowercasedQuery));

        // Lógica para mostrar 2 proyectos, 2 tareas y 1 cliente si es posible
        const prioritizedResults: SearchData[] = [];
        const projectsFound = filtered.filter(item => item.type === 'project').slice(0, 2);
        const tasksFound = filtered.filter(item => item.type === 'task').slice(0, 2);
        const clientsFound = filtered.filter(item => item.type === 'client').slice(0, 1);

        prioritizedResults.push(...projectsFound, ...tasksFound, ...clientsFound);

        // Rellena con otros resultados si no se completan los 5
        const remainingResults = filtered.filter(item => !prioritizedResults.some(p => p.id === item.id));
        const finalResults = [...prioritizedResults, ...remainingResults].slice(0, 5);

        setSearchResults(finalResults);
    };

    const getResultLink = (item: SearchData) => {
        switch (item.type) {
            case 'project': return `/dashboard/projects/${item.id}`;
            case 'task': return `/dashboard/tasks/${item.id}`; // Asumiendo que esta es la ruta para ver una tarea
            case 'client': return `/dashboard/clients`; // Asumiendo que esta es la ruta para ver un cliente
            default: return '#';
        }
    };

    const handleLogout = async () => {
        await signOut();
    }

    const unreadNotifications = tasks.filter(task => task.status !== 'completed').length;

    return (
        <header className="flex h-16 items-center justify-between border-b border-background bg-background-secondary px-6 shadow-sm">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md animate-fade-in-down" onBlur={() => setTimeout(() => setIsSearchOpen(false), 150)}>
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Buscar proyectos, tareas, clientes..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery && setIsSearchOpen(true)}
                    className="w-full rounded-md border border-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                {isSearchOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-100 w-full rounded-md bg-background-secondary p-2 shadow-lg ring-1 ring-background ring-opacity-5 animate-fade-in">
                        {searchResults.length > 0 ? (
                            searchResults.map(item => (
                                <Link
                                    key={`${item.type}-${item.id}`}
                                    href={getResultLink(item)}
                                    className="flex items-center rounded-md px-4 py-2 text-sm text-foreground hover:bg-background"
                                >
                                    {item.type === 'project' && <FolderKanban size={16} className="mr-2 text-primary" />}
                                    {item.type === 'task' && <ClipboardCheck size={16} className="mr-2 text-yellow-500" />}
                                    {item.type === 'client' && <Building2 size={16} className="mr-2 text-green-500" />}
                                    {item.name}
                                </Link>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-foreground-secondary">
                                No se encontraron resultados.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Side - Actions and Profile */}
            <div className="ml-auto flex items-center space-x-4">
                {/* Quick Create Button */}
                <div className="relative">
                    <button
                        onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-full cursor-pointer bg-primary text-foreground transition-all duration-200 hover:scale-105 hover:bg-primary-hover animate-subtle-pulse"
                        title="Crear nuevo..."
                    >
                        <Plus size={24} />
                    </button>
                    {isQuickCreateOpen && (
                        <div className="absolute right-0 top-12 z-20 w-48 rounded-md bg-background-secondary p-2 shadow-lg ring-1 ring-background ring-opacity-5 animate-fade-in">
                            <Link href="/dashboard/projects/new" className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-background-secondary">
                                Nuevo Proyecto
                            </Link>
                            <Link href="/dashboard/tasks/new" className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-background-secondary">
                                Nueva Tarea
                            </Link>
                            <Link href="/dashboard/clients/new" className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-background-secondary">
                                Nuevo Cliente
                            </Link>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative p-2 cursor-pointer text-foreground-secondary hover:text-foreground transition-colors duration-200"
                        title="Notificaciones"
                    >
                        <Bell size={24} />
                        {unreadNotifications > 0 && (
                            <span className="absolute -right-0 -top-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-xs text-foreground animate-subtle-pulse">
                                {unreadNotifications}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-12 z-20 w-80 rounded-md bg-background-secondary p-3 shadow-lg ring-1 ring-background ring-opacity-5 animate-fade-in">
                            <h3 className="mb-2 text-sm font-semibold text-foreground">Notificaciones</h3>
                            <ul className="space-y-2">
                                {tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <li key={task.id} className="border-b border-background pb-2 last:border-b-0">
                                            <p className="text-sm text-foreground-secondary">{task.description ?? task.title}</p>
                                            <span className="text-xs text-foreground-secondary">{task.due_date ?? 'N/A'}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-foreground-secondary">No hay notificaciones nuevas.</li>
                                )}
                            </ul>
                            <Link href="/dashboard/settings?tab=notifications" className="mt-3 block text-center text-sm text-primary hover:underline">
                                Ver todas
                            </Link>
                        </div>
                    )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center space-x-2 rounded-full p-1 cursor-pointer text-foreground hover:bg-background transition-colors duration-200"
                        title="Perfil de usuario"
                    >
                        {userData.avatar_url ? (
                            <Image
                                src={userData.avatar_url}
                                alt={userData.username ?? userData.email ?? "Usuario"}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <User size={32} className="rounded-full bg-background-secondary p-1 text-foreground-secondary" />
                        )}
                        <span className="hidden text-sm font-medium text-foreground-secondary md:block">{userData.username ?? userData.email ?? "Freelance"}</span>
                        <ChevronDown size={16} className="text-foreground-secondary" />
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 top-12 z-20 w-48 rounded-md cursor-pointer bg-background-secondary p-2 shadow-lg ring-1 ring-background ring-opacity-5 animate-fade-in">
                            <Link href="/dashboard/profile" className="block rounded-md px-4 py-2 text-sm text-foreground-secondary hover:bg-background">
                                <User size={16} className="inline-block mr-2" /> Mi Perfil
                            </Link>
                            <Link href="/dashboard/settings" className="block rounded-md cursor-pointer px-4 py-2 text-sm text-foreground-secondary hover:bg-background">
                                <Settings size={16} className="inline-block mr-2" /> Configuración
                            </Link>
                            <div className="my-1 border-t border-background-secondary"></div>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center rounded-md px-4 py-2 text-left text-sm cursor-pointer text-secondary hover:bg-background">
                                <LogOut size={16} className="inline-block mr-2" /> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}