// @/app/components/projects/ProjectKanbanCard.tsx

import Link from 'next/link';
import { Project } from '@/lib/types';
import { Calendar, DollarSign } from 'lucide-react';

interface ProjectKanbanCardProps {
    project: Project;
    clientName: string;
    onDragStart: (e: React.DragEvent, projectId: string) => void;
}

export default function ProjectKanbanCard({ project, clientName, onDragStart }: ProjectKanbanCardProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);


    let formattedDate = 'N/A';
    if (project.due_date) {
        const dueDate = new Date(project.due_date);
        dueDate.setHours(0, 0, 0, 0); // Normalizar a inicio del día

        // Comparaciones
        if (dueDate.getTime() === today.getTime()) {
            formattedDate = 'Hoy';
        } else if (dueDate.getTime() === tomorrow.getTime()) {
            formattedDate = 'Mañana';
        } else if (dueDate.getTime() === yesterday.getTime()) {
            formattedDate = 'Ayer';
        } else {
            // Si no es hoy, mañana o ayer, formatear normalmente
            formattedDate = dueDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    }

    return (
        <div
            draggable
            onDragStart={(e) => {
                onDragStart(e, project.id)
                e.dataTransfer.setData('text/plain', project.id);
                e.dataTransfer.effectAllowed = 'move';
            }}
            className="bg-background-secondary p-4 rounded-lg shadow-sm border border-background-secondary cursor-grab active:cursor-grabbing transition-shadow duration-200 hover:shadow-md"
        >
            <Link href={`/dashboard/projects/${project.id}`} className="block">
                <h3 className="font-semibold text-foreground-primary mb-2">{project.name}</h3>
                <p className="text-sm text-foreground-secondary mb-3">{clientName}</p>

                <div className="flex items-center justify-between text-xs text-foreground-secondary">
                    <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formattedDate}</span>
                    </div>
                    {project.budget && (
                        <div className="flex items-center space-x-1">
                            <DollarSign size={14} />
                            <span>{project.budget.toLocaleString('es-ES')}</span>
                        </div>
                    )}
                </div>

                <div className="mt-3 h-1.5 w-full rounded-full bg-foreground-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress || 0}%` }}></div>
                </div>
            </Link>
        </div>
    );
}