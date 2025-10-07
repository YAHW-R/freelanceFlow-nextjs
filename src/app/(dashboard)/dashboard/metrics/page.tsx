// app/(dashboard)/metrics/page.tsx

'use client'; // Client Component para gráficos interactivos

import { useState, useEffect } from 'react';
import { BarChart2, PieChart, TrendingUp, Clock, Target } from 'lucide-react';
// Importa tus componentes de gráfico aquí (ej. de Recharts, Nivo, Chart.js)
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MetricsPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d'); // Periodo de tiempo

    // Datos de ejemplo para gráficos
    const incomeData = [
        { name: 'Ene', income: 4000 }, { name: 'Feb', income: 3000 }, { name: 'Mar', income: 5000 },
        { name: 'Abr', income: 4500 }, { name: 'May', income: 6000 }, { name: 'Jun', income: 5500 },
    ];
    const projectStatusData = [
        { name: 'En Progreso', value: 5 },
        { name: 'Finalizados', value: 12 },
        { name: 'Pendientes', value: 3 },
    ];

    useEffect(() => {
        // Aquí cargarías tus métricas reales de Supabase
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); // Simula carga
        return () => clearTimeout(timer);
    }, [timeframe]); // Recargar si cambia el periodo de tiempo

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-gray-600">
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
                        onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
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
                        <p className="text-2xl font-bold text-primary mt-1">€12,345</p>
                    </div>
                    <TrendingUp size={36} className="text-primary-hover opacity-70" />
                </div>
                <div className="bg-background-secondary rounded-lg shadow-md p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground-secondary">Proyectos Activos</p>
                        <p className="text-2xl font-bold text-foreground-primary mt-1">5</p>
                    </div>
                    <BarChart2 size={36} className="text-secondary opacity-70" />
                </div>
                <div className="bg-background-secondary rounded-lg shadow-md p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground-secondary">Tareas Completadas</p>
                        <p className="text-2xl font-bold text-foreground-primary mt-1">42</p>
                    </div>
                    <Target size={36} className="text-green-600 opacity-70" />
                </div>
                <div className="bg-background-secondary rounded-lg shadow-md p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground-secondary">Horas Registradas</p>
                        <p className="text-2xl font-bold text-foreground-primary mt-1">160</p>
                    </div>
                    <Clock size={36} className="text-blue-600 opacity-70" />
                </div>
            </div>

            {/* Secciones de Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up animation-delay-200">
                <div className="bg-background-secondary rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-foreground-primary mb-4 flex items-center space-x-2">
                        <BarChart2 size={20} className="text-primary" />
                        <span>Ingresos Mensuales</span>
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
                        <p>Gráfico de Ingresos (Placeholder)</p>
                    </div>
                </div>

                <div className="bg-background-secondary rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-foreground-primary mb-4 flex items-center space-x-2">
                        <PieChart size={20} className="text-primary" />
                        <span>Estado de Proyectos</span>
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
                    <span>Top Proyectos por Presupuesto</span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-background-secondary divide-y divide-gray-200">
                            {/* Ejemplo de datos, reemplazar con datos reales */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground-primary">Desarrollo de API para App Móvil</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">Tech Innovators S.A.</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">€8,000</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En Progreso</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground-primary">Consultoría de Estrategia Digital</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">Startup Growth</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">€5,000</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Pendiente</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}