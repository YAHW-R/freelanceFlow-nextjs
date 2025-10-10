// @/app/(dashboard)/projects/kanban/page.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Filter, Search } from 'lucide-react';
import { getProjects, updateProjectStatus } from '@/app/actions/projectsActions';
import { getClients } from '@/app/actions/clientActions';
import { Project, ClientOptions, ProjectStatus } from '@/lib/types';
import ProjectKanbanColumn from '@/app/components/projects/ProjectKanbanColumn';

export default function ProjectsKanbanPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<ClientOptions[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterClient, setFilterClient] = useState<string | 'Todos'>('Todos');

    // Definir los estados del Kanban (columnas)
    const KANBAN_STATUSES: ProjectStatus[] = ['pending', 'in_progress', 'on_hold', 'completed'];

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
                console.error('Error al cargar datos para el Kanban de proyectos:', err);
                setError(`No se pudieron cargar los datos: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Proyectos filtrados para mostrar en las columnas
    const filteredProjects = useMemo(() => {
        let currentProjects = projects.filter(p => p.status !== 'archived'); // Excluimos los archivados

        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentProjects = currentProjects.filter(
                project => project.name.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        // Filtrar por cliente
        if (filterClient !== 'Todos') {
            currentProjects = currentProjects.filter(project => project.client_id === filterClient);
        }

        return currentProjects;
    }, [projects, searchTerm, filterClient]);

    // Agrupar proyectos por estado para las columnas del Kanban
    const projectsByStatus = useMemo(() => {
        const grouped = new Map<ProjectStatus, Project[]>();
        KANBAN_STATUSES.forEach(status => grouped.set(status, []));

        filteredProjects.forEach(project => {
            if (grouped.has(project.status)) {
                grouped.get(project.status)?.push(project);
            }
        });

        return grouped;
    }, [filteredProjects, KANBAN_STATUSES]);

    // Manejadores para Drag & Drop
    const handleDragStart = (e: React.DragEvent, projectId: string) => {
        setDraggedProjectId(projectId);
        e.dataTransfer.setData('text/plain', projectId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        if (!target.classList.contains('bg-primary-hover/10')) {
            target.classList.add('bg-primary-hover/10');
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('bg-primary-hover/10');
    };

    const handleDrop = async (e: React.DragEvent, newStatus: ProjectStatus) => {
        e.preventDefault();
        handleDragLeave(e);
        const projectId = e.dataTransfer.getData('text/plain');

        if (projectId && draggedProjectId === projectId) {
            const originalStatus = projects.find(p => p.id === projectId)?.status;
            if (originalStatus === newStatus) return;

            // Actualización optimista de la UI
            setProjects(prevProjects =>
                prevProjects.map(p => (p.id === projectId ? { ...p, status: newStatus } : p))
            );
            setDraggedProjectId(null);

            try {
                await updateProjectStatus(projectId, newStatus);
            } catch (err) {
                console.error('Error al actualizar el estado del proyecto:', err);
                setError('No se pudo actualizar el estado del proyecto.');
                // Revertir en caso de error
                if (originalStatus) {
                    setProjects(prevProjects =>
                        prevProjects.map(p => (p.id === projectId ? { ...p, status: originalStatus } : p))
                    );
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
                <p className="text-xl font-medium text-foreground-secondary">Cargando tablero de proyectos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-red-600">
                <p className="text-xl font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] space-y-6">
            <div className="flex items-center justify-between animate-fade-in-down">
                <h1 className="text-3xl font-bold text-foreground-primary">Kanban de Proyectos</h1>
                <div className="flex items-center space-x-3">
                    <Link href="/dashboard/projects/new" className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                        <Plus size={18} className="mr-2" /> Crear Proyecto
                    </Link>
                </div>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-start md:space-x-4 md:space-y-0 bg-background-secondary p-4 rounded-lg shadow-sm animate-fade-in-down animation-delay-100">
                <div className="relative flex-1 max-w-sm">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre de proyecto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary focus:ring-primary text-foreground-primary sm:text-sm"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-foreground-secondary" />
                    <select
                        value={filterClient}
                        onChange={(e) => setFilterClient(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="Todos">Todos los Clientes</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-1 flex space-x-6 overflow-x-auto p-4 custom-scrollbar bg-background-secondary rounded-lg shadow-inner animate-fade-in-up animation-delay-200">
                {KANBAN_STATUSES.map((status) => (
                    <ProjectKanbanColumn
                        key={status}
                        status={status}
                        projects={projectsByStatus.get(status) || []}
                        clients={clients}
                        onProjectDragStart={handleDragStart}
                        onColumnDragOver={handleDragOver}
                        onColumnDragLeave={handleDragLeave}
                        onColumnDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
}