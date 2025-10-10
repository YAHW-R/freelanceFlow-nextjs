// app/(dashboard)/projects/[id]/TaskOverview.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ListTodo, Plus, CheckCircle, Circle, Loader2, Info, Edit, Trash2, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client'; // Cliente de componente
import type { Task, TaskStatus } from '@/lib/types'; // Asume que tienes un tipo Task

interface TaskOverviewProps {
    projectId: string;
}

export default function TaskOverview({ projectId }: TaskOverviewProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'Todos'>('Todos');
    const supabase = createClient();

    useEffect(() => {
        async function fetchTasks() {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('tasks')
                .select('*')
                .eq('project_id', projectId) // Filtra las tareas por el ID del proyecto
                .order('due_date', { ascending: true }); // Ordena por fecha de entrega

            if (fetchError) {
                console.error('Error fetching tasks:', fetchError);
                setError('No se pudieron cargar las tareas.');
                setTasks([]); // Vaciar tareas en caso de error
            } else {
                setTasks(data as Task[]);
            }
            setLoading(false);
        }

        fetchTasks();

        // Opcional: Suscribirse a cambios en tiempo real si quieres que las tareas se actualicen
        // automáticamente cuando se añaden, editan o eliminan.
        const channel = supabase
            .channel('tasks_channel')
            .on(
                'postgres_changes',
                {
                    event: '*', // INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'tasks',
                    filter: `project_id=eq.${projectId}`
                },
                (payload) => {
                    console.log('Cambio en tareas detectado:', payload);
                    fetchTasks(); // Vuelve a cargar las tareas cuando hay un cambio
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel); // Limpia la suscripción al desmontar el componente
        };
    }, [projectId, supabase]); // Vuelve a ejecutar si el projectId o la instancia de supabase cambian

    const filteredTasks = useMemo(() => {
        if (filterStatus === 'Todos') return tasks;
        return tasks.filter(task => task.status === filterStatus);
    }, [tasks, filterStatus]);

    const handleToggleTaskStatus = async (taskId: string, currentStatus: TaskStatus) => {


        const newStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        setLoading(true); // O puedes manejar el loading individualmente por tarea
        const { error: updateError } = await supabase
            .from('tasks')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', taskId);

        if (updateError) {
            console.error('Error al actualizar estado de tarea:', updateError);
            setError('Error al actualizar la tarea.');
        } else {
            // Optimizacion UI: Actualiza el estado local directamente sin refetch (más rápido)
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
            // Si usas Realtime, el refetch ya lo hará, pero esto es más inmediato
        }
        setLoading(false);
    };

    const getTaskStatusDisplay = (status: TaskStatus) => {
        switch (status) {
            case 'pending': return { icon: <Circle size={16} className="text-yellow-500" />, color: 'text-yellow-500', text: 'Pendiente' };
            case 'in_progress': return { icon: <Loader2 size={16} className="text-blue-500 animate-spin" />, color: 'text-blue-500', text: 'En Progreso' };
            case 'completed': return { icon: <CheckCircle size={16} className="text-green-500" />, color: 'text-green-500', text: 'Completada' };
            default: return { icon: <Info size={16} className="text-gray-400" />, color: 'text-gray-400', text: status };
        }
    };

    if (loading && tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-foreground-secondary">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="mt-4 text-lg">Cargando tareas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background-secondary p-6 rounded-lg shadow-md text-red-600 text-center animate-fade-in">
                <p className="font-medium text-lg">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="bg-background-secondary p-8 rounded-lg shadow-md space-y-6 animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-foreground-primary flex items-center space-x-2">
                    <ListTodo size={24} className="text-primary" />
                    <span>Tareas del Proyecto</span>
                </h2>
                <Link
                    href={`/dashboard/projects/${projectId}/tasks/new`}
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <Plus size={18} className="mr-2" /> Añadir Tarea
                </Link>
            </div>

            {/* Filtros de Tareas (Opcional) */}
            <div className="flex items-center space-x-4">
                <label htmlFor="taskFilter" className="text-sm font-medium text-foreground-secondary">Mostrar:</label>
                <select
                    id="taskFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'Todos')}
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                >
                    <option value="Todos">Todas</option>
                    <option value="pending">Pendientes</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completadas</option>
                </select>
            </div>

            {/* Lista de Tareas */}
            {filteredTasks.length > 0 ? (
                <ul className="space-y-4">
                    {filteredTasks.map((task) => {
                        const statusDisplay = getTaskStatusDisplay(task.status as TaskStatus);
                        const formattedDueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin fecha';
                        return (
                            <li key={task.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-md animate-fade-in-left">
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                    <button
                                        onClick={() => handleToggleTaskStatus(task.id, task.status as TaskStatus)}
                                        className="flex items-center space-x-2 text-foreground-primary hover:text-primary-hover transition-colors duration-200 focus:outline-none"
                                        aria-label={`Marcar tarea "${task.title}" como ${task.status === 'completed' ? 'Pendiente' : 'Completada'}`}
                                    >
                                        {task.status === 'completed' ? (
                                            <CheckCircle size={20} className="text-green-500" />
                                        ) : (
                                            <Circle size={20} className="text-gray-400" />
                                        )}
                                        <span className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </span>
                                    </button>
                                    <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {statusDisplay.text}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 ml-4">
                                    {task.due_date && (
                                        <span className="text-sm text-foreground-secondary flex items-center space-x-1">
                                            <Calendar size={14} className="text-secondary" />
                                            <span>{formattedDueDate}</span>
                                        </span>
                                    )}
                                    <Link href={`/dashboard/projects/${projectId}/tasks/${task.id}/edit`} className="text-secondary hover:text-primary-hover transition-colors duration-200" title="Editar Tarea">
                                        <Edit size={16} />
                                    </Link>
                                    <button className="text-red-500 hover:text-red-700 transition-colors duration-200" title="Eliminar Tarea">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="text-center py-10 text-foreground-secondary">
                    <p className="text-lg">No hay tareas para este proyecto.</p>
                    <Link
                        href={`/dashboard/projects/${projectId}/tasks/new`}
                        className="mt-4 inline-flex items-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover"
                    >
                        <Plus size={18} className="mr-2" /> Añadir la primera tarea
                    </Link>
                </div>
            )}
        </div>
    );
}