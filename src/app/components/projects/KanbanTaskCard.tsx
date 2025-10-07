// @/app/components/kanban/KanbanTaskCard.tsx

import Link from 'next/link';
import { Calendar, CheckCircle2, CircleDashed, Clock, Projector, Flag } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/lib/types'; // Usa tus tipos globales

interface KanbanTaskCardProps {
    task: Task;
    onDragStart?: (e: React.DragEvent, taskId: string) => void; // Para el arrastrar
}

const getStatusStyles = (status: TaskStatus) => {
    switch (status) {
        case 'Pendiente':
            return 'bg-blue-100 text-blue-800';
        case 'En Progreso':
            return 'bg-yellow-100 text-yellow-800';
        case 'Completada':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPriorityStyles = (priority: TaskPriority) => {
    switch (priority) {
        case 'Baja':
            return 'bg-gray-200 text-gray-700';
        case 'Media':
            return 'bg-orange-200 text-orange-800';
        case 'Alta':
            return 'bg-red-200 text-red-800';
        default:
            return 'bg-gray-200 text-gray-700';
    }
};

const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
        case 'Pendiente': return <CircleDashed size={16} className="text-blue-600" />;
        case 'En Progreso': return <Clock size={16} className="text-yellow-600" />;
        case 'Completada': return <CheckCircle2 size={16} className="text-green-600" />;
        default: return <CircleDashed size={16} className="text-gray-600" />;
    }
};

export default function KanbanTaskCard({ task, onDragStart }: KanbanTaskCardProps) {
    const formattedDueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Sin fecha';

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-3 cursor-grab hover:shadow-lg transition-shadow duration-200 animate-fade-in-up"
        >
            <div className="flex justify-between items-start">
                <h3 className="text-md font-bold text-foreground-primary">
                    <Link href={`/dashboard/tasks/${task.id}`} className="hover:text-primary-hover transition-colors duration-200">
                        {task.title}
                    </Link>
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityStyles(task.priority as TaskPriority)} flex items-center space-x-1`}>
                    <Flag size={12} />
                    <span>{task.priority}</span>
                </span>
            </div>

            {task.project_id && (
                <p className="text-xs text-foreground-secondary flex items-center space-x-1">
                    <Projector size={14} className="text-secondary" />
                    <span>Proyecto: <Link href={`/dashboard/projects/${task.project_id}`} className="font-medium hover:text-primary-hover">{task.project_id}</Link></span>
                </p>
            )}

            {task.description && (
                <p className="text-xs text-foreground-secondary line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between text-xs text-foreground-secondary pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                    <Calendar size={14} className="text-secondary" />
                    <span>{formattedDueDate}</span>
                </div>
                {/* El estado ya está implícito en la columna, pero se puede mostrar si se desea */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(task.status as TaskStatus)} flex items-center space-x-1`}>
                    {getStatusIcon(task.status as TaskStatus)}
                    <span>{task.status}</span>
                </span>
            </div>

            {/* Opcional: Botón de ver detalles si el Link del título no es suficiente */}
            {/* <div className="mt-auto flex justify-end">
        <Link
          href={`/dashboard/tasks/${task.id}`}
          className="text-xs font-medium text-primary hover:underline transition-colors duration-200"
        >
          Ver Detalles
        </Link>
      </div> */}
        </div>
    );
}