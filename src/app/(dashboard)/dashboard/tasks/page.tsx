'use client';

import { useState, useEffect, useMemo, DragEvent } from 'react';
import Link from 'next/link';
import { Plus, Filter, Search } from 'lucide-react';
import TaskKanbanColumn from '@/app/components/tasks/TaskKanbanColumn';
import { getTasksUser as getTasksForUser, updateTaskStatus } from '@/app/actions/taskActions';
import { TaskWithProjectName, TaskStatus } from '@/lib/types';
import { TASK_STATUS_ARRAY } from '@/lib/global';

export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskWithProjectName[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterProject, setFilterProject] = useState<string | 'Todos'>('Todos');

    useEffect(() => {
        async function fetchTasks() {
            setLoading(true);
            try {
                const fetchedTasks = await getTasksForUser();
                setTasks(fetchedTasks);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('Error fetching tasks for Kanban:', err);
                setError(`Could not load tasks: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, []);

    const projectsInTasks = useMemo(() => {
        const uniqueProjects = new Map<string, string>();
        tasks.forEach(task => {
            if (task.project_id && task.projects?.name) {
                uniqueProjects.set(task.project_id, task.projects.name);
            }
        });
        return Array.from(uniqueProjects.entries()).map(([id, name]) => ({ id, name }));
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        let currentTasks = tasks;

        if (searchTerm.trim()) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentTasks = currentTasks.filter(
                task =>
                    task.title.toLowerCase().includes(lowercasedSearchTerm) ||
                    task.description?.toLowerCase().includes(lowercasedSearchTerm) ||
                    task.projects?.name?.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        if (filterProject !== 'Todos') {
            currentTasks = currentTasks.filter(task => task.project_id === filterProject);
        }

        return currentTasks;
    }, [tasks, searchTerm, filterProject]);

    const tasksByStatus = useMemo(() => {
        const grouped = new Map<TaskStatus, TaskWithProjectName[]>();
        TASK_STATUS_ARRAY.forEach(status => grouped.set(status, []));

        filteredTasks.forEach(task => {
            grouped.get(task.status as TaskStatus)?.push(task);
        });

        return grouped;
    }, [filteredTasks]);

    // Drag & Drop Handlers
    const handleDragStart = (e: DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.setData('text/plain', taskId);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
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
            const originalStatus = tasks.find(t => t.id === taskId)?.status;
            if (originalStatus === newStatus) return;

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
            setDraggedTaskId(null);

            try {
                await updateTaskStatus(taskId, newStatus);
            } catch (err) {
                console.error('Error updating task status:', err);
                setError('Could not update task status.');
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
                    <p className="text-xl font-medium">Cargando tablero de tareas...</p>
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
        <div className="flex flex-col h-full md:w-full p-4 md:p-6 space-y-4 bg-background">
            {/* Header and Action Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 animate-fade-in-down">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground-primary text-center md:text-left">Tablero de Tareas</h1>
                <div className="flex items-center justify-center space-x-2">
                    <Link
                        href="/dashboard/tasks/new"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors duration-200 w-full md:w-auto"
                    >
                        <Plus size={16} className="mr-2" />
                        <span>Añadir Tarea</span>
                    </Link>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 bg-background-secondary p-3 rounded-lg shadow-sm animate-fade-in-down animation-delay-100">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Buscar tarea..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary focus:ring-primary text-foreground-primary sm:text-sm"
                    />
                </div>
                <div className="relative flex-1">
                    <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <select
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                        className="w-full appearance-none rounded-md border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="Todos">Todos los Proyectos</option>
                        {projectsInTasks.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Kanban Columns Container */}
            <div className="flex-1 flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6 bg-background-secondary rounded-lg shadow-inner p-4">
                <div className="flex-1 flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6 md:overflow-x-auto custom-scrollbar">
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
        </div>
    );
}