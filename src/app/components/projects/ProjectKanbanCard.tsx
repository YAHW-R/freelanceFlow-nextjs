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
    const formattedDueDate = project.due_date
        ? new Date(project.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        : 'N/A';

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, project.id)}
            className="bg-background-secondary p-4 rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing transition-shadow duration-200 hover:shadow-md"
        >
            <Link href={`/dashboard/projects/${project.id}`} className="block">
                <h3 className="font-semibold text-foreground-primary mb-2">{project.name}</h3>
                <p className="text-sm text-foreground-secondary mb-3">{clientName}</p>

                <div className="flex items-center justify-between text-xs text-foreground-secondary">
                    <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formattedDueDate}</span>
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