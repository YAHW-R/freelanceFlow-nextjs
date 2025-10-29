

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, KanbanSquare, Filter, Search } from 'lucide-react';
import { getProjects } from '@/app/actions/projectsActions';
import { getClients } from '@/app/actions/clientActions';
import { Project, ClientOptions, ProjectStatus } from '@/lib/types';
import ProjectKanbanColumn from '@/app/components/projects/ProjectKanbanColumn';
import { PROJECT_STATUS_ARRAY } from '@/lib/global';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<ClientOptions[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterClient, setFilterClient] = useState<string | 'Todos'>('Todos');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [fetchedProjects, fetchedClients] = await Promise.all([
                    getProjects(),
                    getClients()
                ]);
                setProjects(fetchedProjects || []);
                setClients(fetchedClients || []);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                console.error('Error fetching data for projects Kanban:', err);
                setError(`Could not load data: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredProjects = useMemo(() => {
        let currentProjects = projects;

        if (searchTerm.trim()) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentProjects = currentProjects.filter(
                project => project.name.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        if (filterClient !== 'Todos') {
            currentProjects = currentProjects.filter(project => project.client_id === filterClient);
        }

        return currentProjects;
    }, [projects, searchTerm, filterClient]);

    const projectsByStatus = useMemo(() => {
        const grouped = new Map<ProjectStatus, Project[]>();
        PROJECT_STATUS_ARRAY.forEach(status => grouped.set(status, []));

        filteredProjects.forEach(project => {
            if (grouped.has(project.status)) {
                grouped.get(project.status)?.push(project);
            }
        });

        return grouped;
    }, [filteredProjects]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary">
                <div className="flex items-center space-x-2 text-primary-hover">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-medium">Cargando tablero de proyectos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-red-600">
                <p className="text-xl font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4 md:p-6 space-y-4">
            {/* Header and Action Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 animate-fade-in-down">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground-primary">Kanban de Proyectos</h1>
                <div className="flex items-center space-x-2">
                    <Link
                        href="/dashboard/projects/new"
                        className="flex-1 md:flex-initial inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors duration-200"
                    >
                        <Plus size={16} className="mr-2" />
                        <span className="hidden sm:inline">Crear Proyecto</span>
                        <span className="sm:hidden">Nuevo</span>
                    </Link>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 bg-background-secondary p-3 rounded-lg shadow-sm animate-fade-in-down animation-delay-100">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Buscar proyecto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary focus:ring-primary text-foreground-primary sm:text-sm"
                    />
                </div>
                <div className="relative flex-1">
                    <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <select
                        value={filterClient}
                        onChange={(e) => setFilterClient(e.target.value)}
                        className="w-full appearance-none rounded-md border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="Todos">Todos los Clientes</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Kanban Columns Container */}
            <div className="flex-1 flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6 md:overflow-x-auto custom-scrollbar -m-4 p-4">
                {PROJECT_STATUS_ARRAY.map((status) => (
                    <ProjectKanbanColumn
                        key={status}
                        status={status}
                        projects={projectsByStatus.get(status) ?? []}
                        clients={clients}
                    />
                ))}
            </div>
        </div>
    );
}