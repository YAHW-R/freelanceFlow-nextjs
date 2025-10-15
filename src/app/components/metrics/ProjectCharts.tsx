// /components/metrics/ProjectCharts.tsx
'use client';

import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ProjectProgressData {
    date: string;
    started: number;
    completed: number;
}

interface ProjectStatusData {
    name: string;
    value: number;
    color: string;
}

interface ProjectChartsProps {
    progressData: ProjectProgressData[];
    statusData: ProjectStatusData[];
}

export default function ProjectCharts({ progressData, statusData }: ProjectChartsProps) {
    return (
        <>
            <div className="bg-background-secondary rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-foreground-primary mb-4 flex items-center space-x-2" title="Progreso de proyectos en el período seleccionado">
                    <PieChartIcon size={20} className="text-primary" />
                    <span>Progreso de Proyectos</span>
                </h2>
                {progressData.some(d => d.started > 0 || d.completed > 0) ? (
                    <ResponsiveContainer width="100%" height={256}>
                        <LineChart data={progressData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} labelStyle={{ color: 'hsl(var(--foreground))' }} />
                            <Legend />
                            <Line type="monotone" dataKey="started" name="Iniciados" stroke="#3b82f6" strokeWidth={2} />
                            <Line type="monotone" dataKey="completed" name="Completados" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-foreground-secondary">
                        <p>No se iniciaron ni completaron proyectos en este período.</p>
                    </div>
                )}
            </div>
        </>
    );
}