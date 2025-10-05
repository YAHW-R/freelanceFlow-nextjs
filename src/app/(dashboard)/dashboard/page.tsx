'use client'; // Necesario si usas estados locales o interacciones de cliente

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Project, Profile, Client, Task } from '@/lib/types';
import { fetchDashboardData } from '@/app/actions/dashboardActions';

// Iconos para el dashboard
import { Sparkles, CalendarCheck, TrendingUp, DollarSign } from 'lucide-react';

import { getUserProfile } from '@/app/actions/profileActions';

export default function DashboardPage() {

    const [profile, setProfile] = useState<Profile>({
        id: '',
        username: '',
        fullname: '',
        email: ''
    });

    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const tasksDueToday = tasks.filter(task => task.due_date === 'Hoy').length;


    const projectsInProgress = projects.filter(project => project.status === 'En Progreso').length;

    useEffect(() => {
        // Aquí podrías cargar el perfil del usuario si es necesario
        getUserProfile().then(profile => {
            if (profile) {
                setProfile(profile);
            }
        });

        // Cargar datos del dashboard
        fetchDashboardData().then(data => {
            setProjects(data.projects || []);
            setClients(data.clients || []);
            setTasks(data.tasks || []);
        });
    }, [profile.id]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Saludo y Título Principal */}
            <h1 className="text-4xl font-extrabold text-foreground animate-fade-in-down">
                👋 Hola, {profile.username ?? profile.email ?? "Freelance"}!
            </h1>

            {/* Tarjetas de Resumen (Overview Cards) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-background-secondary p-6 shadow-md animate-fade-in-down">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold bg-background-secondary">Ingresos del Mes</h3>
                        <DollarSign size={24} className="text-green-acent" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-foreground">$12,500.00</p>
                    <p className="mt-1 text-sm text-foreground-secondary">+15% respecto al mes anterior</p>
                </div>

                <div className="rounded-lg bg-background-secondary p-6 shadow-md animate-fade-in-down delay-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{projects.length <= 1 ? "Proyecto Activo" : "Proyectos Activos"}</h3>
                        <TrendingUp size={24} className="text-blue-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-foreground">{projects.length}</p>
                    <p className="mt-1 text-sm text-foreground-secondary">{projectsInProgress >= 1 ? projectsInProgress + " tareas en progreso" : ""}</p>
                </div>

                <div className="rounded-lg bg-background-secondary p-6 shadow-md animate-fade-in-down delay-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Tareas Pendientes</h3>
                        <CalendarCheck size={24} className="text-orange-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-foreground">{tasks.filter(task => task.status === "Pendiente").length}</p>
                    <p className="mt-1 text-sm text-foreground-secondary">{tasksDueToday >= 1 ? tasksDueToday + " vencen hoy" : ""}</p>
                </div>

                <div className="rounded-lg bg-background-secondary p-6 shadow-md animate-fade-in-down delay-300">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Asistente IA</h3>
                        <Sparkles size={24} className="text-purple-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-foreground">¡Activo!</p>
                    <p className="mt-1 text-sm text-foreground-secondary">Pregúntale cualquier cosa</p>
                </div>
            </div>

            {/* Proyectos en Progreso */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-background-secondary p-6 shadow-md animate-fade-in-left">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">Proyectos en Progreso</h2>
                        <Link href="/dashboard/projects" className="text-sm font-medium text-primary hover:underline">
                            Ver Todos
                        </Link>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {projects.filter(p => p.status === 'En Progreso' || p.status === 'Pendiente').map(project => (
                            <li key={project.id} className="border-b border-foreground-secondary pb-4 last:border-b-0 last:pb-0">
                                <Link href={`/dashboard/projects/${project.id}`} className="block hover:text-primary-hover transition-colors duration-200">
                                    <h3 className="text-lg font-medium text-foreground">{project.name}</h3>
                                </Link>
                                <p className="text-sm text-foreground-secondary">Cliente: {clients.find(client => client.id === project.client_id)?.name}</p>
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <span className="text-foreground-secondary">Progreso: {project.progress}%</span>
                                    <div className="h-1.5 w-1/2 rounded-full bg-foreground">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-foreground-secondary">Vence: {new Date(project.due_date ?? Date.now()).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tareas Urgentes / Próximas */}
                <div className="rounded-lg bg-background-secondary p-6 shadow-md animate-fade-in-left delay-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">Mis Tareas</h2>
                        <Link href="/dashboard/tasks" className="text-sm font-medium text-primary hover:underline">
                            Ver Todas
                        </Link>
                    </div>
                    <ul className="mt-4 space-y-3">
                        {tasks.map(task => (
                            <li key={task.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`task-${task.id}`}
                                    className="h-4 w-4 rounded border-foreground-secondary text-primary focus:ring-primary-hover"
                                // checked={task.status === 'Completado'} // Aquí integrarías la lógica de estado
                                // onChange={() => toggleTaskStatus(task.id)}
                                />
                                <label htmlFor={`task-${task.id}`} className="ml-3 text-sm font-medium text-foreground">
                                    {task.title} <span className="text-foreground-secondary">({projects.find(project => project.id === task.project_id)?.name})</span>
                                </label>
                                <span className={`ml-auto text-xs font-semibold ${task.due_date === 'Hoy' ? 'text-secondary' : 'text-foreground-secondary'}`}>
                                    {task.due_date}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}