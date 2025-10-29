'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Bell, Search, Plus, User, FolderKanban, ClipboardCheck, Building2, LogOut, Settings, ChevronDown
} from 'lucide-react';
import Image from 'next/image';

import { getUserProfile } from '@/app/actions/profileActions';
import { signOut } from '@/app/actions/authActions';
import { getTasksUser } from '@/app/actions/taskActions';
import { getProjects } from '@/app/actions/projectsActions';
import { getClients } from '@/app/actions/clientActions';
import { Profile, TaskWithProjectName, Project, Client } from '../../../lib/types';

// Unified type for search data
interface SearchData {
    id: string;
    name: string;
    type: 'project' | 'task' | 'client';
}

export default function Topbar() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    useEffect(() => {
        const fetchUserData = async () => {
            const profile = await getUserProfile();
            if (profile) setUserData(profile);
        };

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setIsSearchOpen(false);
            setSearchResults([]);
            return;
        }

        setIsSearchOpen(true);

        const projectSearchData: SearchData[] = projects.map(p => ({ id: p.id, name: p.name, type: 'project' }));
        const clientSearchData: SearchData[] = clients.map(c => ({ id: c.id, name: c.name, type: 'client' }));
        const taskSearchData: SearchData[] = tasks.map(t => ({ id: t.id, name: t.title, type: 'task' }));

        const allData: SearchData[] = [...projectSearchData, ...clientSearchData, ...taskSearchData];

        const lowercasedQuery = query.toLowerCase();
        const filtered = allData.filter(item => item.name.toLowerCase().includes(lowercasedQuery));

        const prioritizedResults: SearchData[] = [];
        const projectsFound = filtered.filter(item => item.type === 'project').slice(0, 2);
        const tasksFound = filtered.filter(item => item.type === 'task').slice(0, 2);
        const clientsFound = filtered.filter(item => item.type === 'client').slice(0, 1);

        prioritizedResults.push(...projectsFound, ...tasksFound, ...clientsFound);

        const remainingResults = filtered.filter(item => !prioritizedResults.some(p => p.id === item.id));
        const finalResults = [...prioritizedResults, ...remainingResults].slice(0, 5);

        setSearchResults(finalResults);
    };

    const getResultLink = (item: SearchData) => {
        switch (item.type) {
            case 'project': return `/dashboard/projects/${item.id}`;
            case 'task': return `/dashboard/tasks`; // Assuming a generic tasks page
            case 'client': return `/dashboard/clients`; // Assuming a generic clients page
            default: return '#';
        }
    };

    const handleLogout = async () => {
        await signOut();
    };

    const unreadNotifications = tasks.filter(task => task.status !== 'completed').length;

    const SearchResultsPanel = () => (
        <div className="p-2">
            {searchResults.length > 0 ? (
                searchResults.map(item => (
                    <Link
                        key={`${item.type}-${item.id}`}
                        href={getResultLink(item)}
                        className="flex items-center rounded-md px-4 py-2 text-sm text-foreground hover:bg-background"
                        onClick={() => setIsSearchOpen(false)}
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
    );

    return (
        <header className="flex h-16 items-center justify-between border-b border-background bg-background-secondary px-4 md:px-6 shadow-sm">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md" onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}>
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                <input
                    type="search"
                    placeholder="Buscar proyectos, tareas, clientes..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery && setIsSearchOpen(true)}
                    className="w-full rounded-md border border-background bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                {isSearchOpen && (
                    <>
                        {/* Mobile Search Overlay */}
                        <div className="md:hidden fixed inset-0 z-60">
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}></div>
                            <div className="relative z-50 mt-20 mx-4 rounded-lg bg-background-secondary shadow-lg animate-fade-in">
                                <SearchResultsPanel />
                            </div>
                        </div>
                        {/* Desktop Search Dropdown */}
                        <div className="hidden md:block absolute left-0 right-0 top-full mt-2 z-30 w-full rounded-md bg-background-secondary shadow-lg ring-1 ring-background ring-opacity-5 animate-fade-in">
                            <SearchResultsPanel />
                        </div>
                    </>
                )}
            </div>

            {/* Right Side - Actions and Profile */}
            <div className="ml-4 flex items-center space-x-2 md:space-x-4">
                {/* Quick Create Button */}
                <div className="relative">
                    <button
                        onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                        className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full cursor-pointer bg-primary text-foreground transition-transform duration-200 hover:scale-105"
                        title="Crear nuevo..."
                    >
                        <Plus size={20} className="md:hidden" />
                        <Plus size={24} className="hidden md:block" />
                    </button>
                    {isQuickCreateOpen && (
                        <div className="absolute right-0 top-12 z-20 w-56 md:w-48 rounded-md bg-background-secondary p-2 shadow-lg ring-1 ring-background ring-opacity-5 animate-fade-in">
                            <Link href="/dashboard/projects/new" className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-background">Nuevo Proyecto</Link>
                            <Link href="/dashboard/tasks/new" className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-background">Nueva Tarea</Link>
                            <Link href="/dashboard/clients/new" className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-background">Nuevo Cliente</Link>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative p-2 cursor-pointer text-foreground-secondary hover:text-foreground transition-colors"
                        title="Notificaciones"
                    >
                        <Bell size={20} className="md:hidden" />
                        <Bell size={24} className="hidden md:block" />
                        {unreadNotifications > 0 && (
                            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-xs text-foreground">
                                {unreadNotifications}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-12 z-20 w-72 md:w-80 rounded-md bg-background-secondary p-3 shadow-lg ring-1 ring-background ring-opacity-5 animate-fade-in">
                            <h3 className="mb-2 text-sm font-semibold text-foreground">Notificaciones</h3>
                            <ul className="space-y-2">
                                {tasks.length > 0 ? (
                                    tasks.slice(0, 5).map((task) => (
                                        <li key={task.id} className="border-b border-background pb-2 last:border-b-0 text-ellipsis overflow-hidden whitespace-nowrap">
                                            <p className="text-sm text-foreground-secondary">{task.description ?? task.title}</p>
                                            <span className="text-xs text-foreground-secondary">{task.due_date ?? 'N/A'}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-foreground-secondary">No hay notificaciones nuevas.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center space-x-2 rounded-full p-1 cursor-pointer text-foreground hover:bg-background transition-colors"
                    >
                        {userData.avatar_url ? (
                            <Image src={userData.avatar_url} alt={userData.username || 'Usuario'} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                            <User size={32} className="rounded-full bg-background p-1 text-foreground-secondary" />
                        )}
                        <span className="hidden text-sm font-medium md:block">{userData.username || 'Freelancer'}</span>
                        <ChevronDown size={16} className="hidden md:block text-foreground-secondary" />
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 top-12 z-20 w-56 md:w-48 rounded-md bg-background-secondary p-2 shadow-lg ring-1 ring-background ring-opacity-5 animate-fade-in">
                            <Link href="/dashboard/profile" className="flex items-center rounded-md px-4 py-2 text-sm text-foreground-secondary hover:bg-background"><User size={16} className="mr-2" /> Mi Perfil</Link>
                            <Link href="/dashboard/settings" className="flex items-center rounded-md px-4 py-2 text-sm text-foreground-secondary hover:bg-background"><Settings size={16} className="mr-2" /> Configuración</Link>
                            <div className="my-1 border-t border-background"></div>
                            <button onClick={handleLogout} className="flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-secondary hover:bg-background"><LogOut size={16} className="mr-2" /> Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}