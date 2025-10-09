// app/(dashboard)/tasks/new/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, PlusCircle, Calendar, Flag, ListTodo } from 'lucide-react';
import { createTask } from '@/app/actions/taskActions';
import { getProjects } from '@/app/actions/projectsActions';
import { Project } from '@/lib/types';
import type { TaskStatus, TaskPriority, Task, CreateTask } from '@/lib/types';
import Link from 'next/link';

export default function NewTaskPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [formLoading, setFormLoading] = useState<boolean>(true); // Para cargar proyectos
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Para el envío del formulario
    const [error, setError] = useState<string | null>(null);

    // Estados del formulario
    const [user_id, setUserId] = useState("")// Reemplaza con la lógica para obtener el ID del usuario actual
    const [name, setName] = useState<string>('');
    const [projectId, setProjectId] = useState<string>(''); // ID del proyecto seleccionado (o vacío para tarea personal)
    const [description, setDescription] = useState<string>('');
    const [status, setStatus] = useState<TaskStatus>('Pendiente'); // Estado inicial por defecto
    const [dueDate, setDueDate] = useState<string>(''); // Formato 'YYYY-MM-DD'
    const [priority, setPriority] = useState<TaskPriority>('Media'); // Prioridad por defecto

    useEffect(() => {
        async function fetchProjects() {
            setFormLoading(true);
            try {
                const fetchedProjects = await getProjects();
                setProjects(fetchedProjects);
                if (fetchedProjects.length > 0) {
                    setProjectId(fetchedProjects[0].id);
                    setUserId(fetchedProjects[0].user_id) // Selecciona el primer proyecto por defecto
                } else {
                    // Si no hay proyectos, redirigir
                    router.push('/dashboard/projects/new?redirectBack=/dashboard/tasks/new');
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error('Error al cargar proyectos:', err.message);
                }
            }
            finally {
                setFormLoading(false);
            }
        }
        fetchProjects();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!name.trim()) {
            setError('El título de la tarea es requerido.');
            setIsSubmitting(false);
            return;
        }
        if (!dueDate) {
            setError('La fecha de vencimiento es requerida.');
            setIsSubmitting(false);
            return;
        }

        try {
            const formData: CreateTask = {
                title: name.trim(),
                user_id,
                project_id: projectId, // undefined para que Supabase use null si no hay proyecto
                description: description ? description.trim() : undefined,
                status,
                due_date: dueDate,
                priority,
            };

            await createTask(formData);
            router.push('/dashboard/tasks'); // Redirige a la lista de tareas
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Error desconocido al crear la tarea.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (formLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="mt-4 text-lg">Cargando proyectos disponibles...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Crear Nueva Tarea</h1>
                <Link href="/dashboard/tasks" className="text-sm font-medium text-primary hover:underline">
                    Volver a Tareas
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-background-secondary p-8 rounded-lg shadow-md">
                {/* Título de la Tarea */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground-secondary">
                        Título de la Tarea <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Ej: Completar diseño de componente de botón"
                    />
                </div>

                {/* Selección de Proyecto (Opcional) */}
                <div>
                    <label htmlFor="projectId" className="block text-sm font-medium text-foreground-secondary">
                        Asignar a Proyecto (Opcional)
                    </label>
                    <select
                        id="projectId"
                        name="projectId"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                    >
                        <option value="">-- Tarea Personal (Sin Proyecto) --</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    {projects.length === 0 && (
                        <p className="mt-2 text-sm text-foreground-secondary">
                            ¿No tienes proyectos aún?{' '}
                            <Link href="/dashboard/projects/new?redirectBack=/dashboard/tasks/new" className="font-medium underline hover:text-primary-hover">
                                Crea uno aquí
                            </Link>
                            .
                        </p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground-secondary">
                        Descripción (Opcional)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Detalles sobre la tarea, pasos a seguir, etc."
                    ></textarea>
                </div>

                {/* Estado y Prioridad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Estado del Proyecto */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-foreground-secondary">
                            Estado
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Progreso">En Progreso</option>
                            <option value="Bloqueada">Bloqueada</option>
                            {/* 'Finalizada' no debería ser una opción al crear */}
                        </select>
                    </div>

                    {/* Prioridad */}
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-foreground-secondary">
                            Prioridad
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as TaskPriority)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                        >
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>
                </div>

                {/* Fecha de Vencimiento */}
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-foreground-secondary">
                        Fecha de Vencimiento <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 animate-fade-in">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md border border-transparent bg-primary py-2 px-4 text-base font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin mr-2" /> Creando Tarea...
                        </span>
                    ) : (
                        'Crear Tarea'
                    )}
                </button>
            </form>
        </div>
    );
}