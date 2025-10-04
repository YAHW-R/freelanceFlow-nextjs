// app/(dashboard)/projects/page.tsx

'use client'; // Necesario para useState, filtros interactivos y useRouter

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, SlidersHorizontal, ArrowUpCircle } from 'lucide-react'; // Iconos para la interfaz
import ProjectCard from '@/app/components/projects/projectCard';


import type { ClientOptions, Project, ProjectStatus } from '@/lib/types';


import { getProjects } from '@/app/actions/projectsActions';
import { getClients } from '@/app/actions/clientActions';

// Tipos para ordenar
type SortKey = 'name' | 'dueDate' | 'status' | 'progress';
type SortOrder = 'asc' | 'desc';

export default function ProjectsPage() {

    // Estados para proyectos y manejo de carga/error
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<ClientOptions[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'Todos'>('Todos');
    const [sortKey, setSortKey] = useState<SortKey>('dueDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    useEffect(() => {
        // Función para cargar proyectos desde Supabase
        async function fetchProjects() {
            setLoading(true);
            await getProjects()
                .then((data) => {
                    setProjects(data ?? []);
                    setError(null);
                })
                .catch((err) => {
                    console.error('Error al cargar proyectos:', err);
                    setError('No se pudieron cargar los proyectos. Intenta nuevamente más tarde.');
                })
                .finally(() => setLoading(false));
        }

        // Función para cargar clientes (opcional, si necesitas mostrar nombres de clientes)
        async function fetchClients() {
            await getClients()
                .then((data) => {
                    setClients(data ?? []);
                })
                .catch((err) => {
                    console.error('Error al cargar clientes:', err);
                });
        }


        fetchProjects();
        fetchClients();
    }, []); // Se ejecuta una vez al montar el componente

    // Proyectos filtrados y ordenados (Memoized para optimizar)
    const filteredAndSortedProjects = useMemo(() => {
        let currentProjects = [...projects];

        // 1. Filtrar por estado
        if (filterStatus !== 'Todos') {
            currentProjects = currentProjects.filter(project => project.status === filterStatus);
        }

        // 2. Filtrar por término de búsqueda (nombre o cliente)
        if (searchTerm.trim()) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentProjects = currentProjects.filter(
                project =>
                    project.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    project.client_id.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        // 3. Ordenar
        currentProjects.sort((a, b) => {
            let comparison = 0;
            if (sortKey === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortKey === 'dueDate') {
                comparison = new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime();
            } else if (sortKey === 'status') {
                // Orden alfabético o según un orden predefinido si es necesario
                comparison = a.status.localeCompare(b.status);
            } else if (sortKey === 'progress') {
                comparison = a.progress - b.progress;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return currentProjects;
    }, [projects, filterStatus, searchTerm, sortKey, sortOrder]);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary">
                <div className="flex items-center space-x-2 text-primary-hover">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-medium">Cargando proyectos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-red-600">
                <p className="text-xl font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 rounded-md bg-primary py-2 px-4 text-sm font-medium text-foreground shadow-sm hover:bg-primary-hover">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Encabezado y Botón de Acción */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Mis Proyectos</h1>
                <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-fade-in-down"
                >
                    <Plus size={18} className="mr-2" /> Crear Proyecto
                </Link>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0 bg-background-secondary p-4 rounded-lg shadow-sm animate-fade-in-down delay-100">
                {/* Búsqueda */}
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Buscar proyectos por nombre o cliente..."
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary focus:ring-primary text-foreground-primary sm:text-sm"
                    />
                </div>

                {/* Filtro por Estado */}
                <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-foreground-secondary" />
                    <select
                        value={filterStatus}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as ProjectStatus | 'Todos')}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="Todos">Todos los Estados</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Archivado">Archivado</option>
                        <option value="En Pausa">En Pausa</option>
                    </select>
                </div>

                {/* Ordenar por */}
                <div className="flex items-center space-x-2">
                    <SlidersHorizontal size={20} className="text-foreground-secondary" />
                    <select
                        value={sortKey}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortKey(e.target.value as SortKey)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="dueDate">Fecha de Entrega</option>
                        <option value="name">Nombre</option>
                        <option value="status">Estado</option>
                        <option value="progress">Progreso</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="rounded-md border border-background p-2 text-foreground-secondary hover:bg-background transition-colors duration-200"
                        title={sortOrder === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente'}
                    >
                        <ArrowUpCircle size={18} className={`${sortOrder === 'asc' ? '' : 'rotate-180'} transition-transform duration-200`} />
                    </button>
                </div>
            </div>

            {/* Lista de Proyectos */}
            {filteredAndSortedProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} clients={clients} />
                    ))}
                </div>
            ) : (
                <div className="col-span-full py-10 text-center text-foreground-secondary animate-fade-in">
                    <p className="text-lg">No se encontraron proyectos.</p>
                    <button onClick={() => { setSearchTerm(''); setFilterStatus('Todos'); setSortKey('dueDate'); setSortOrder('asc'); }} className="mt-4 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                        Resetear filtros
                    </button>
                </div>
            )}
        </div>
    );
}