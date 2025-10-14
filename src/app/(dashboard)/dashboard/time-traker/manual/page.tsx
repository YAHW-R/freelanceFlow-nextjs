// @/app/(dashboard)/dashboard/time-tracker/manual/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, PlusSquare, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { getProjects } from '@/app/actions/projectsActions';
import { getTasksByProject } from '@/app/actions/taskActions';
import { createTimeEntry } from '@/app/actions/timeTrakerActions';
import { Project, Task } from '@/lib/types';

export default function ManualTimeEntryPage() {

    // Estados para datos y carga
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(false);

    // Estados del formulario
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [durationMinutes, setDurationMinutes] = useState<number | ''>('');
    const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today

    // Estados de UI y feedback
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Cargar proyectos
    useEffect(() => {
        async function fetchProjects() {
            try {
                const activeProjects = await getProjects();
                const filtered = activeProjects.filter(p => p.status === 'in_progress' || p.status === 'in_pause' || p.status === 'pending');
                setProjects(filtered);
            } catch {
                setError('No se pudieron cargar los proyectos.');
            } finally {
                setLoadingProjects(false);
            }
        }
        fetchProjects();
    }, []);

    // Cargar tareas al seleccionar un proyecto
    useEffect(() => {
        if (!selectedProjectId) {
            setTasks([]);
            setSelectedTaskId('');
            return;
        }

        async function fetchTasks() {
            setLoadingTasks(true);
            setError(null);
            try {
                const projectTasks = await getTasksByProject(selectedProjectId);
                const activeTasks = projectTasks.filter(t => t.status !== 'completed');
                setTasks(activeTasks);
            } catch {
                setError('No se pudieron cargar las tareas para este proyecto.');
            } finally {
                setLoadingTasks(false);
            }
        }
        fetchTasks();
    }, [selectedProjectId]);

    // Enviar el formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProjectId || !selectedTaskId || durationMinutes === '' || durationMinutes <= 0) {
            setError('Por favor, completa todos los campos requeridos.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await createTimeEntry({
                project_id: selectedProjectId,
                task_id: selectedTaskId,
                duration_seconds: durationMinutes * 60,
                description: description || undefined,
                entry_date: new Date(entryDate).toISOString(),
            });
            setSuccessMessage('¡Entrada de tiempo guardada correctamente!');
            // Resetear formulario
            setSelectedProjectId('');
            setSelectedTaskId('');
            setDescription('');
            setDurationMinutes('');
        } catch {
            setError('Error al guardar el registro de tiempo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary flex items-center">
                    <PlusSquare size={28} className="mr-3 text-primary" />
                    Registro Manual de Tiempo
                </h1>
                <Link href="/dashboard/time-traker" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                    <ArrowLeft size={16} className="mr-1" /> Volver al Timer
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-background-secondary p-8 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="project" className="block text-sm font-medium text-foreground-secondary">Proyecto *</label>
                        <select id="project" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                            <option value="">{loadingProjects ? 'Cargando...' : 'Selecciona un proyecto'}</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="task" className="block text-sm font-medium text-foreground-secondary">Tarea *</label>
                        <select id="task" value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} required disabled={!selectedProjectId || loadingTasks} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                            <option value="">{loadingTasks ? 'Cargando...' : 'Selecciona una tarea'}</option>
                            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-foreground-secondary">Fecha *</label>
                        <input type="date" id="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-foreground-secondary">Duración (minutos) *</label>
                        <input type="number" id="duration" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value === '' ? '' : parseInt(e.target.value, 10))} required min="1" placeholder="Ej: 45" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground-secondary">Descripción</label>
                    <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" placeholder="Describe el trabajo realizado..."></textarea>
                </div>

                {error && <p className="text-sm text-red-600 text-center flex items-center justify-center"><AlertCircle size={16} className="mr-2" />{error}</p>}
                {successMessage && <p className="text-sm text-green-600 text-center flex items-center justify-center"><CheckCircle size={16} className="mr-2" />{successMessage}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-lg font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} className="mr-2" />}
                    Guardar Entrada
                </button>
            </form>
        </div>
    );
}