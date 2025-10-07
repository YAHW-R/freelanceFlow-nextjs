import Link from 'next/link';
import { Calendar, CheckCircle2, CircleDashed, Clock, Projector, Flag } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/lib/types'; // Asegúrate de que los tipos estén bien importados

interface TaskCardProps {
    task: Task;
}

const getStatusStyles = (status: TaskStatus) => {
    switch (status) {
        case 'Pendiente':
            return 'bg-blue-100 text-blue-800';
        case 'En Progreso':
            return 'bg-yellow-100 text-yellow-800';
        case 'Completada':
            return 'bg-green-100 text-green-800';
        case 'Completada':
            return 'bg-red-100 text-red-800';
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

export default function TaskCard({ task }: TaskCardProps) {
    const formattedDueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

    return (
        <div className="bg-background-secondary rounded-lg shadow-md p-6 flex flex-col space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-foreground-primary">
                    <Link href={`/dashboard/tasks/${task.id}`} className="hover:text-primary-hover transition-colors duration-200">
                        {task.title}
                    </Link>
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(task.status as TaskStatus)} flex items-center space-x-1`}>
                    {getStatusIcon(task.status as TaskStatus)}
                    <span>{task.status}</span>
                </span>
            </div>

            {task.project_id && (
                <p className="text-sm text-foreground-secondary flex items-center space-x-2">
                    <Projector size={16} className="text-secondary" />
                    <span>Proyecto: <Link href={`/dashboard/projects/${task.project_id}`} className="font-medium hover:text-primary-hover">{task.project_id}</Link></span>
                </p>
            )}

            {task.description && (
                <p className="text-sm text-foreground-secondary line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between text-sm text-foreground-secondary pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                    <Calendar size={16} className="text-secondary" />
                    <span>{formattedDueDate}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyles(task.priority as TaskPriority)} flex items-center space-x-1`}>
                    <Flag size={14} />
                    <span>{task.priority}</span>
                </span>
            </div>

            <div className="mt-auto flex justify-end">
                <Link
                    href={`/dashboard/tasks/${task.id}`}
                    className="text-sm font-medium text-primary hover:underline transition-colors duration-200"
                >
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
}