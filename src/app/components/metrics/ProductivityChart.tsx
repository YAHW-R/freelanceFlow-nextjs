// /components/metrics/ProductivityChart.tsx
'use client';

import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface ProductivityData {
    date: string;
    hours: number;
    tasksCompleted: number;
}

interface ProductivityChartProps {
    data: ProductivityData[];
}

export default function ProductivityChart({ data }: ProductivityChartProps) {
    return (
        <div className="bg-background-secondary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-foreground-primary mb-4 flex items-center space-x-2">
                <BarChart2 size={20} className="text-primary" />
                <span>Productividad (Horas/Día)</span>
            </h2>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={256}>
                    <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" label={{ value: 'Horas', angle: -90, position: 'insideLeft', fill: '#8884d8' }} tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Tareas', angle: 90, position: 'insideRight', fill: '#82ca9d' }} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                            formatter={(value: number, name: string) => (name === 'Horas Trabajadas' ? [`${value}h`, name] : [value, name])}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="hours" name="Horas Trabajadas" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="tasksCompleted" name="Tareas Completadas" stroke="#82ca9d" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-64 flex items-center justify-center text-foreground-secondary"><p>No hay datos de productividad para este período.</p></div>
            )}
        </div>
    );
}