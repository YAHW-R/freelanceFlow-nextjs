// app/(dashboard)/page.tsx

'use client'; // Necesario si usas estados locales o interacciones de cliente

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CalendarCheck, TrendingUp, DollarSign } from 'lucide-react'; // Iconos para el dashboard
import { Project, ProjectStatus } from '@/app/components/types'; // Importamos tipos si los usamos

// Datos de prueba (en una app real, vendrían de una API)
const mockProjects: Project[] = [
    { id: 'p1', name: 'Rediseño Web UX/UI', clientName: 'Innovate Corp', status: 'En Progreso', progress: 70, dueDate: '2024-11-20' },
    { id: 'p2', name: 'Campaña Marketing Digital', clientName: 'Global Brands', status: 'En Progreso', progress: 45, dueDate: '2024-12-10' },
    { id: 'p3', name: 'Desarrollo Backend API', clientName: 'Tech Solutions', status: 'Pendiente', progress: 0, dueDate: '2024-11-05' },
];

const mockTasks = [
    { id: 't1', title: 'Revisar wireframes de Home', project: 'Rediseño Web UX/UI', dueDate: 'Hoy', status: 'Urgente' },
    { id: 't2', title: 'Llamar a Cliente Global Brands', project: 'Campaña Marketing Digital', dueDate: 'Mañana', status: 'Pendiente' },
    { id: 't3', title: 'Enviar propuesta de Project X', project: 'N/A', dueDate: 'Viernes', status: 'Pendiente' },
];

export default function DashboardPage() {
    const [userName] = useState<string>('Freelancer'); // Nombre de usuario de prueba

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Saludo y Título Principal */}
            <h1 className="text-4xl font-extrabold text-foreground animate-fade-in-down">
                👋 Hola, {userName}!
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
                        <h3 className="text-lg font-semibold text-foreground">Proyectos Activos</h3>
                        <TrendingUp size={24} className="text-blue-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-foreground">5</p>
                    <p className="mt-1 text-sm text-foreground-secondary">2 comenzados esta semana</p>
                </div>

                <div className="rounded-lg bg-background-secondary p-6 shadow-md animate-fade-in-down delay-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Tareas Pendientes</h3>
                        <CalendarCheck size={24} className="text-orange-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-foreground">8</p>
                    <p className="mt-1 text-sm text-foreground-secondary">3 vencen hoy</p>
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
                        <Link href="/dashboard/projects" className="text-sm font-medium text-cyan-600 hover:underline">
                            Ver Todos
                        </Link>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {mockProjects.filter(p => p.status === 'En Progreso' || p.status === 'Pendiente').map(project => (
                            <li key={project.id} className="border-b border-foreground-secondary pb-4 last:border-b-0 last:pb-0">
                                <Link href={`/dashboard/projects/${project.id}`} className="block hover:text-cyan-600 transition-colors duration-200">
                                    <h3 className="text-lg font-medium text-foreground">{project.name}</h3>
                                </Link>
                                <p className="text-sm text-foreground-secondary">Cliente: {project.clientName}</p>
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <span className="text-foreground-secondary">Progreso: {project.progress}%</span>
                                    <div className="h-1.5 w-1/2 rounded-full bg-foreground">
                                        <div
                                            className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-foreground-secondary">Vence: {new Date(project.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tareas Urgentes / Próximas */}
                <div className="rounded-lg bg-background-secondary p-6 shadow-md animate-fade-in-left delay-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">Mis Tareas</h2>
                        <Link href="/dashboard/tasks" className="text-sm font-medium text-cyan-600 hover:underline">
                            Ver Todas
                        </Link>
                    </div>
                    <ul className="mt-4 space-y-3">
                        {mockTasks.map(task => (
                            <li key={task.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`task-${task.id}`}
                                    className="h-4 w-4 rounded border-foreground-secondary text-cyan-600 focus:ring-cyan-500"
                                // checked={task.status === 'Completado'} // Aquí integrarías la lógica de estado
                                // onChange={() => toggleTaskStatus(task.id)}
                                />
                                <label htmlFor={`task-${task.id}`} className="ml-3 text-sm font-medium text-foreground">
                                    {task.title} <span className="text-foreground-secondary">({task.project})</span>
                                </label>
                                <span className={`ml-auto text-xs font-semibold ${task.dueDate === 'Hoy' ? 'text-red-500' : 'text-gray-500'}`}>
                                    {task.dueDate}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}