// app/(dashboard)/tasks/page.tsx

'use client';

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import Link from 'next/link';
import { Plus, Search, SlidersHorizontal, ArrowUpCircle, Filter, Flag } from 'lucide-react';
import TaskCard from '@/app/components/tasks/TaskCard';
import type { TaskStatus, TaskPriority, TaskWithProjectName } from '@/lib/types';


import { getTasksUser } from '@/app/actions/taskActions';

// Tipos para ordenar
type SortKey = 'name' | 'due_date' | 'status' | 'priority' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function TasksPage() {

    const [tasks, setTasks] = useState<TaskWithProjectName[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'Todos'>('Todos');
    const [filterPriority, setFilterPriority] = useState<TaskPriority | 'Todas'>('Todas');
    const [sortKey, setSortKey] = useState<SortKey>('due_date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    useEffect(() => {
        async function fetchTasks() {
            setLoading(true);
            const tasks: TaskWithProjectName[] = await getTasksUser();
            if (!tasks) {
                setError('Error al cargar las tareas. Por favor, inténtalo de nuevo.');
                setLoading(false);
                return;
            }

            setTasks(tasks);
            setLoading(false);
        }

        fetchTasks();
    }, []);

    const filteredAndSortedTasks = useMemo(() => {
        let currentTasks = [...tasks];

        // 1. Filtrar por estado
        if (filterStatus !== 'Todos') {
            currentTasks = currentTasks.filter(task => task.status === filterStatus);
        }

        // 2. Filtrar por prioridad
        if (filterPriority !== 'Todas') {
            currentTasks = currentTasks.filter(task => task.priority === filterPriority);
        }

        // 3. Filtrar por término de búsqueda (nombre, descripción o nombre del proyecto)
        if (searchTerm.trim()) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentTasks = currentTasks.filter(
                task =>
                    task.title.toLowerCase().includes(lowercasedSearchTerm) ||
                    task.description?.toLowerCase().includes(lowercasedSearchTerm) ||
                    task.project_name?.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        // 4. Ordenar
        currentTasks.sort((a, b) => {
            let comparison = 0;
            if (sortKey === 'name') {
                comparison = a.title.localeCompare(b.title);
            } else if (sortKey === 'due_date') {
                const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity; // Tareas sin fecha al final
                const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
                comparison = dateA - dateB;
            } else if (sortKey === 'status') {
                // Podrías definir un orden específico para los estados si no quieres el alfabético
                comparison = a.status.localeCompare(b.status);
            } else if (sortKey === 'priority') {
                const priorityOrder: Record<TaskPriority, number> = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
                comparison = priorityOrder[a.priority as TaskPriority] - priorityOrder[b.priority as TaskPriority];
            } else if (sortKey === 'created_at') {
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return currentTasks;
    }, [tasks, filterStatus, filterPriority, searchTerm, sortKey, sortOrder]);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-gray-600">
                <div className="flex items-center space-x-2 text-primary-hover">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-medium">Cargando tareas...</p>
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
        <div className="space-y-6">
            {/* Encabezado y Botón de Acción */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Mis Tareas</h1>
                <Link
                    href="/dashboard/tasks/new"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-fade-in-down"
                >
                    <Plus size={18} className="mr-2" /> Añadir Tarea
                </Link>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0 bg-background-secondary p-4 rounded-lg shadow-sm animate-fade-in-down animation-delay-100">
                {/* Búsqueda */}
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Buscar tareas por nombre, descripción o proyecto..."
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
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as TaskStatus | 'Todos')}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="Todos">Todos los Estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Finalizada">Finalizada</option>
                        <option value="Bloqueada">Bloqueada</option>
                    </select>
                </div>

                {/* Filtro por Prioridad */}
                <div className="flex items-center space-x-2">
                    <Flag size={20} className="text-foreground-secondary" />
                    <select
                        value={filterPriority}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value as TaskPriority | 'Todas')}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="Todas">Todas las Prioridades</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
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
                        <option value="due_date">Fecha de Vencimiento</option>
                        <option value="name">Nombre</option>
                        <option value="status">Estado</option>
                        <option value="priority">Prioridad</option>
                        <option value="created_at">Fecha de Creación</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="rounded-md border border-gray-300 p-2 text-foreground-secondary hover:bg-gray-100 transition-colors duration-200"
                        title={sortOrder === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente'}
                    >
                        <ArrowUpCircle size={18} className={`${sortOrder === 'asc' ? '' : 'rotate-180'} transition-transform duration-200`} />
                    </button>
                </div>
            </div>

            {/* Lista de Tareas */}
            {filteredAndSortedTasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="col-span-full py-10 text-center text-foreground-secondary animate-fade-in">
                    <p className="text-lg">No se encontraron tareas con los filtros actuales.</p>
                    <button onClick={() => { setSearchTerm(''); setFilterStatus('Todos'); setFilterPriority('Todas'); setSortKey('due_date'); setSortOrder('asc'); }} className="mt-4 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                        Resetear filtros
                    </button>
                </div>
            )}
        </div>
    );
}