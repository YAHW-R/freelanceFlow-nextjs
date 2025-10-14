// app/(dashboard)/metrics/page.tsx

'use client'; // Client Component para gráficos interactivos

import { useState, useEffect } from 'react';
import { BarChart2, PieChart, TrendingUp, Clock, Target, AlertCircle } from 'lucide-react';
import { getProjects } from '@/app/actions/projectsActions';
import { getClients } from '@/app/actions/clientActions';
import { getTasksUser } from '@/app/actions/taskActions';
import { getTimeEntries } from '@/app/actions/timeTrakerActions'; // Asumimos que esta acción existe
import { Project } from '@/lib/types';

// Importa tus componentes de gráfico aquí (ej. de Recharts, Nivo, Chart.js)
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Timeframe = '7d' | '30d' | '90d' | 'ytd';

interface Metrics {
    income: number;
    activeProjects: number;
    completedTasks: number;
    loggedHours: number;
    topProjects: (Project & { clientName?: string })[];
}

// Helper para obtener el rango de fechas
const getDateRange = (timeframe: Timeframe): { from: Date, to: Date } => {
    const to = new Date();
    const from = new Date();

    switch (timeframe) {
        case '7d':
            from.setDate(to.getDate() - 7);
            break;
        case '30d':
            from.setDate(to.getDate() - 30);
            break;
        case '90d':
            from.setDate(to.getDate() - 90);
            break;
        case 'ytd':
            from.setFullYear(to.getFullYear(), 0, 1);
            break;
    }
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    return { from, to };
};

export default function MetricsPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [timeframe, setTimeframe] = useState<Timeframe>('30d'); // Periodo de tiempo
    const [metrics, setMetrics] = useState<Metrics>({
        income: 0,
        activeProjects: 0,
        completedTasks: 0,
        loggedHours: 0,
        topProjects: [],
    });

    useEffect(() => {
        async function fetchMetrics() {
            setLoading(true);
            setError(null);
            try {
                const { from, to } = getDateRange(timeframe);

                // Fetch all data in parallel
                const [projects, clients, tasks, timeEntries] = await Promise.all([
                    getProjects(),
                    getClients(),
                    getTasksUser(),
                    getTimeEntries({ from: from.toISOString(), to: to.toISOString() }) // Asume que getTimeEntries acepta un rango
                ]);

                // --- Calculate Metrics ---

                // 1. Income: Sum of budgets for projects completed within the timeframe
                // Nota: Esto es una aproximación. El cálculo real puede ser más complejo.
                const income = projects
                    .filter(p => p.status === 'completed' && p.due_date && new Date(p.due_date) >= from && new Date(p.due_date) <= to)
                    .reduce((acc, p) => acc + (p.budget || 0), 0);

                // 2. Active Projects: Total count of projects in progress
                const activeProjects = projects.filter(p => p.status === 'in_progress').length;

                // 3. Completed Tasks: Count of tasks completed within the timeframe
                // Asumimos que la fecha de completado es la de la entrada de tiempo si no hay otro campo
                const completedTasks = tasks.filter(t => t.status === 'completed' && t.updated_at && new Date(t.updated_at) >= from && new Date(t.updated_at) <= to).length;

                // 4. Logged Hours: Sum of all time entries in the period
                const totalSeconds = timeEntries.reduce((acc, entry) => acc + entry.duration_minutes * 60, 0);
                const loggedHours = totalSeconds / 3600;

                // 5. Top Projects by Budget
                const topProjects = [...projects]
                    .sort((a, b) => (b.budget || 0) - (a.budget || 0))
                    .slice(0, 5)
                    .map(p => ({
                        ...p,
                        clientName: clients.find(c => c.id === p.client_id)?.name || 'N/A'
                    }));

                setMetrics({
                    income,
                    activeProjects,
                    completedTasks,
                    loggedHours: parseFloat(loggedHours.toFixed(2)),
                    topProjects,
                });

            } catch (err) {
                console.error("Error fetching metrics:", err);
                setError("No se pudieron cargar las métricas. Por favor, inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [timeframe]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary">
                <div className="flex items-center space-x-2 text-primary-hover">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-medium">Cargando métricas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-red-500 bg-red-500/10 p-8 rounded-lg">
                <AlertCircle size={40} />
                <p className="text-xl font-medium mt-4">{error}</p>
                <button onClick={() => setLoading(true)} className="mt-4 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Encabezado */}
            <div className="flex items-center justify-between animate-fade-in-down">
                <h1 className="text-3xl font-bold text-foreground-primary">Métricas y Reportes</h1>
                <div className="flex items-center space-x-2">
                    <label htmlFor="timeframe" className="text-sm font-medium text-foreground-secondary">Periodo:</label>
                    <select
                        id="timeframe"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary p-2"
                    >
                        <option value="7d">Últimos 7 Días</option>
                        <option value="30d">Últimos 30 Días</option>
                        <option value="90d">Últimos 90 Días</option>
                        <option value="ytd">Este Año</option>
                    </select>
                </div>
            </div>

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-down animation-delay-100">
                <div className="bg-background-secondary rounded-lg shadow-md p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground-secondary">Ingresos ({timeframe === 'ytd' ? 'Año' : 'Periodo'})</p>
                        <p className="text-2xl font-bold text-primary mt-1">€{metrics.income.toLocaleString('es-ES')}</p>
                    </div>
                    <TrendingUp size={36} className="text-primary-hover opacity-70" />
                </div>
                <div className="bg-background-secondary rounded-lg shadow-md p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground-secondary">Proyectos Activos</p>
                        <p className="text-2xl font-bold text-foreground-primary mt-1">{metrics.activeProjects}</p>
                    </div>
                    <BarChart2 size={36} className="text-secondary opacity-70" />
                </div>
                <div className="bg-background-secondary rounded-lg shadow-md p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground-secondary">Tareas Completadas</p>
                        <p className="text-2xl font-bold text-foreground-primary mt-1">{metrics.completedTasks}</p>
                    </div>
                    <Target size={36} className="text-green-600 opacity-70" />
                </div>
                <div className="bg-background-secondary rounded-lg shadow-md p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground-secondary">Horas Registradas</p>
                        <p className="text-2xl font-bold text-foreground-primary mt-1">{metrics.loggedHours}</p>
                    </div>
                    <Clock size={36} className="text-blue-600 opacity-70" />
                </div>
            </div>

            {/* Secciones de Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up animation-delay-200">
                <div className="bg-background-secondary rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-foreground-primary mb-4 flex items-center space-x-2">
                        <BarChart2 size={20} className="text-primary" />
                        <span>Productividad (Horas/Día)</span>
                    </h2>
                    <div className="h-64 flex items-center justify-center text-foreground-secondary">
                        {/* Aquí iría tu componente de gráfico de líneas/barras, ej: */}
                        {/* <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#06B6D4" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer> */}
                        <p>Gráfico de Productividad (Placeholder)</p>
                    </div>
                </div>

                <div className="bg-background-secondary rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-foreground-primary mb-4 flex items-center space-x-2">
                        <PieChart size={20} className="text-primary" />
                        <span>Estado de Proyectos (Total)</span>
                    </h2>
                    <div className="h-64 flex items-center justify-center text-foreground-secondary">
                        {/* Aquí iría tu componente de gráfico de pastel/dona, ej: */}
                        {/* <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer> */}
                        <p>Gráfico de Estado de Proyectos (Placeholder)</p>
                    </div>
                </div>
            </div>

            {/* Otras métricas o tablas (ej. proyectos más rentables) */}
            <div className="bg-background-secondary rounded-lg shadow-md p-6 animate-fade-in-up animation-delay-300">
                <h2 className="text-xl font-bold text-foreground-primary mb-4 flex items-center space-x-2">
                    <BarChart2 size={20} className="text-primary" />
                    <span>Top 5 Proyectos por Presupuesto</span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-background-secondary">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Proyecto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Presupuesto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-background-secondary divide-y divide-gray-200">
                            {metrics.topProjects.length > 0 ? metrics.topProjects.map(project => (
                                <tr key={project.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground-primary">{project.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">{project.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">€{(project.budget || 0).toLocaleString('es-ES')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-foreground-secondary">No hay proyectos para mostrar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}