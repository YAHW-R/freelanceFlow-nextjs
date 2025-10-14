// @/app/(dashboard)/kanban/page.tsx

'use client';

import { useState, useEffect, useMemo, DragEvent } from 'react';
import Link from 'next/link';
import { Plus, LayoutDashboard, Filter, Search } from 'lucide-react';
import TaskKanbanColumn from '@/app/components/tasks/TaskKanbanColumn';
import { getTasksUser as getTasksForUser, updateTaskStatus } from '@/app/actions/taskActions'; // Importa tus Server Actions
import { TaskWithProjectName, TaskStatus } from '@/lib/types'; // Asegúrate de que los tipos estén bien importados

import { TASK_STATUS_ARRAY } from '@/lib/global';

export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskWithProjectName[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterProject, setFilterProject] = useState<string | 'Todos'>('Todos'); // Para filtrar por proyecto

    useEffect(() => {
        async function fetchTasks() {
            setLoading(true);
            try {
                const fetchedTasks = await getTasksForUser();
                console.log(fetchedTasks)
                setTasks(fetchedTasks);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error('Error al cargar tareas para Kanban:', err);
                    setError(err.message || 'No se pudieron cargar las tareas para el tablero Kanban.');
                } else {
                    console.error('Error desconocido al cargar tareas para Kanban:', err);
                    setError('Error desconocido al cargar las tareas para el tablero Kanban.');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, []);

    // Proyectos únicos para el filtro (solo los que tienen tareas)
    const projectsInTasks = useMemo(() => {
        const uniqueProjects = new Map<string, string>(); // Map<project_id, project_name>
        tasks.forEach(task => {
            if (task.project_id && task.projects?.name) {
                uniqueProjects.set(task.project_id, task.projects.name);
            }
        });
        return Array.from(uniqueProjects.entries()).map(([id, name]) => ({ id, name }));
    }, [tasks]);


    // Tareas filtradas para mostrar en las columnas
    const filteredTasks = useMemo(() => {
        let currentTasks = tasks;

        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentTasks = currentTasks.filter(
                task =>
                    task.title.toLowerCase().includes(lowercasedSearchTerm) ||
                    task.description?.toLowerCase().includes(lowercasedSearchTerm) ||
                    task.projects?.name?.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        // Filtrar por proyecto
        if (filterProject !== 'Todos') {
            currentTasks = currentTasks.filter(task => task.project_id === filterProject);
        }

        return currentTasks;
    }, [tasks, searchTerm, filterProject]);


    // Agrupar tareas por estado para las columnas del Kanban
    const tasksByStatus = useMemo(() => {
        const grouped = new Map<TaskStatus, TaskWithProjectName[]>();
        TASK_STATUS_ARRAY.forEach(status => grouped.set(status, [])); // Inicializa todas las columnas

        filteredTasks.forEach(task => {
            grouped.get(task.status as TaskStatus)?.push(task);
        });

        return grouped;
    }, [filteredTasks]);

    // Manejadores para Drag & Drop
    const handleDragStart = (e: DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.setData('text/plain', taskId); // Guarda el ID de la tarea que se está arrastrando
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault(); // Permite soltar
        const target = e.currentTarget as HTMLElement;
        if (!target.classList.contains('bg-primary-hover/10')) {
            target.classList.add('bg-primary-hover/10');
        }
    };

    const handleDragLeave = (e: DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('bg-primary-hover/10');
    };

    const handleDrop = async (e: DragEvent, newStatus: TaskStatus) => {
        e.preventDefault();
        handleDragLeave(e);
        const taskId = e.dataTransfer.getData('text/plain');

        if (taskId && newStatus && draggedTaskId === taskId) {
            // Actualiza la tarea en el frontend inmediatamente para una mejor UX
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
            setDraggedTaskId(null); // Reinicia el estado de la tarea arrastrada

            try {
                await updateTaskStatus(taskId, newStatus);
            } catch (err) {
                console.error('Error al actualizar el estado de la tarea en el servidor:', err);
                setError('No se pudo actualizar el estado de la tarea en el servidor.');
                // Revertir en caso de error
                const originalStatus = tasks.find(t => t.id === taskId)?.status;
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? { ...task, status: originalStatus || newStatus } : task
                    )
                );
            }
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary">
                <div className="flex items-center space-x-2 text-primary-hover">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-medium">Cargando tablero Kanban de tareas...</p>
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
        <div className="flex flex-col h-[calc(100vh-120px)] space-y-6"> {/* Altura ajustada */}
            {/* Encabezado y Botones de Acción */}
            <div className="flex items-center justify-between animate-fade-in-down ">
                <h1 className="text-3xl font-bold text-foreground-primary">Tablero Kanban</h1>
                <div className="flex items-center space-x-3">
                    <Link
                        href="/dashboard/tasks"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-background-secondary px-4 py-2 text-sm font-medium text-foreground-primary shadow-sm transition-colors duration-200 hover:bg-gray-100"
                    >
                        <LayoutDashboard size={18} className="mr-2" /> Vista de Lista
                    </Link>
                    <Link
                        href="/dashboard/tasks/new"
                        className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover"
                    >
                        <Plus size={18} className="mr-2" /> Añadir Tarea
                    </Link>
                </div>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-start md:space-x-4 md:space-y-0 bg-background-secondary p-4 rounded-lg shadow-sm animate-fade-in-down animation-delay-100">
                {/* Búsqueda */}
                <div className="relative flex-1 max-w-sm">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Buscar tarea o proyecto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary focus:ring-primary text-foreground-primary sm:text-sm"
                    />
                </div>

                {/* Filtro por Proyecto */}
                <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-foreground-secondary" />
                    <select
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="Todos">Todos los Proyectos</option>
                        {projectsInTasks.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>
            </div>


            {/* Contenedor de las Columnas Kanban */}
            <div className="flex-1 flex space-x-6 overflow-x-auto p-4 custom-scrollbar bg-background-secondary rounded-lg shadow-inner animate-fade-in-up animation-delay-200">
                {TASK_STATUS_ARRAY.map((status) => (
                    <TaskKanbanColumn
                        key={status}
                        status={status}
                        tasks={tasksByStatus.get(status) ?? []}
                        onTaskDragStart={handleDragStart}
                        onColumnDragOver={handleDragOver}
                        onColumnDrop={handleDrop}
                        onColumnDragLeave={handleDragLeave}
                    />
                ))}
            </div>
        </div>
    );
}