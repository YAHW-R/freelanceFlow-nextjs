// @/app/(dashboard)/dashboard/time-tracker/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Save, PlusSquare, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getProjects } from '@/app/actions/projectsActions';
import { getTasksByProject } from '@/app/actions/taskActions';
import { createTimeEntry } from '@/app/actions/timeTrakerActions';
import { Project, Task } from '@/lib/types';

export default function TimeTrackerPage() {
    // Estados para datos y carga
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(false);

    // Estados de selección del formulario
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    // Estados del temporizador
    const [time, setTime] = useState(0); // en segundos
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    // Estados de UI y feedback
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Cargar proyectos al montar el componente
    useEffect(() => {
        async function fetchProjects() {
            try {
                const activeProjects = await getProjects();
                // Filtramos para mostrar solo proyectos activos o en pausa
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

    // Cargar tareas cuando se selecciona un proyecto
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
                // Filtramos para mostrar solo tareas no completadas
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

    // Lógica del temporizador
    const handleStartStop = () => {
        if (isRunning) {
            // Detener
            if (intervalId) clearInterval(intervalId);
            setIntervalId(null);
        } else {
            // Iniciar
            const newIntervalId = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
            setIntervalId(newIntervalId);
        }
        setIsRunning(!isRunning);
    };

    // Formatear el tiempo para mostrarlo
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    // Enviar el tiempo registrado
    const handleSubmitTime = async () => {
        if (time === 0 || !selectedProjectId || !selectedTaskId) {
            setError('Asegúrate de haber registrado tiempo y seleccionado un proyecto y una tarea.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await createTimeEntry({
                project_id: selectedProjectId,
                task_id: selectedTaskId,
                duration_minutes: time * 60,
                description: description || undefined,
                entry_date: new Date().toISOString(),
            });
            setSuccessMessage(`¡Tiempo de ${formatTime(time)} guardado correctamente!`);
            // Resetear estado
            setTime(0);
            setDescription('');
            setIsRunning(false);
            if (intervalId) clearInterval(intervalId);
            // Opcional: resetear selecciones
            // setSelectedProjectId('');
            // setSelectedTaskId('');
        } catch {
            setError('Error al guardar el registro de tiempo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold text-foreground-primary flex items-center">
                    <Clock size={28} className="mr-3 text-primary" />
                    Time Tracker
                </h1>
                <Link
                    href="/dashboard/time-traker/manual"
                    className="inline-flex items-center justify-center w-full sm:w-auto rounded-md border border-background-secondary bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover"
                >
                    <PlusSquare size={18} className="mr-2" /> Registrar Horas Manualmente
                </Link>
            </div>

            <div className="bg-background-secondary p-4 sm:p-6 md:p-8 rounded-lg shadow-md space-y-6">
                {/* Selección de Proyecto y Tarea */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="project" className="block text-sm font-medium text-foreground-secondary">Proyecto</label>
                        <select
                            id="project"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            disabled={isRunning || loadingProjects}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background text-foreground-primary"
                        >
                            <option value="">{loadingProjects ? 'Cargando...' : 'Selecciona un proyecto'}</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="task" className="block text-sm font-medium text-foreground-secondary">Tarea</label>
                        <select
                            id="task"
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            disabled={isRunning || loadingTasks || !selectedProjectId}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background text-foreground-primary"
                        >
                            <option value="">{loadingTasks ? 'Cargando tareas...' : 'Selecciona una tarea'}</option>
                            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground-secondary">
                        Descripción (¿Qué hiciste?)
                    </label>
                    <textarea
                        id="description"
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background text-foreground-primary"
                        placeholder="Ej: Implementé la autenticación de dos factores..."
                    ></textarea>
                </div>

                {/* Temporizador y Controles */}
                <div className="text-center bg-background p-6 rounded-lg">
                    <p className="text-5xl sm:text-6xl font-mono font-bold text-foreground-primary tracking-wider">{formatTime(time)}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 gap-4 sm:gap-0">
                    <button
                        onClick={handleStartStop}
                        disabled={!selectedProjectId || !selectedTaskId}
                        className={`inline-flex items-center justify-center w-full sm:w-32 rounded-md px-4 py-3 text-lg font-semibold text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isRunning ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
                    >
                        {isRunning ? <Pause size={24} className="mr-2" /> : <Play size={24} className="mr-2" />}
                        {isRunning ? 'Parar' : 'Iniciar'}
                    </button>
                    <button
                        onClick={handleSubmitTime}
                        disabled={isRunning || isSubmitting || time === 0}
                        className="inline-flex items-center justify-center w-full sm:w-32 rounded-md bg-primary px-4 py-3 text-lg font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} className="mr-2" />}
                        {isSubmitting ? '' : 'Guardar'}
                    </button>
                </div>

                {/* Mensajes de feedback */}
                {error && <p className="text-sm text-red-600 text-center flex items-center justify-center"><AlertCircle size={16} className="mr-2" />{error}</p>}
                {successMessage && <p className="text-sm text-green-600 text-center flex items-center justify-center"><CheckCircle size={16} className="mr-2" />{successMessage}</p>}
            </div>
        </div>
    );
}
