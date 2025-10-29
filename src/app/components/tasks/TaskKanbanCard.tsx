import { TaskWithProjectName } from '@/lib/types';
import { Calendar, Flag } from 'lucide-react';
import { useState, useEffect } from 'react';

// Simple hook to check for screen size
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => {
            setMatches(media.matches);
        };
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);

    return matches;
};

interface TaskKanbanCardProps {
    task: TaskWithProjectName;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
}

const priorityConfig: Record<string, { color: string; text: string }> = {
    'low': { color: 'text-green-500', text: 'Baja' },
    'medium': { color: 'text-yellow-500', text: 'Media' },
    'high': { color: 'text-red-500', text: 'Alta' },
};

export default function TaskKanbanCard({ task, onDragStart }: TaskKanbanCardProps) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    let formattedDueDate = 'N/A';
    if (task.due_date) {
        try {
            const date = new Date(task.due_date);
            if (!isNaN(date.getTime())) {
                formattedDueDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
            } else {
                formattedDueDate = 'Fecha inválida';
            }
        } catch (error) {
            console.error('Error parsing date:', task.due_date, error);
            formattedDueDate = 'Fecha inválida';
        }
    }

    const priorityKey = task.priority?.toLowerCase() || '';
    const priority = priorityConfig[priorityKey] || { color: 'text-gray-400', text: task.priority || 'Sin prioridad' };

    return (
        <div
            draggable={isDesktop} // Only allow dragging on desktop
            onDragStart={(e) => isDesktop && onDragStart(e, task.id)}
            className={`bg-background-secondary p-4 rounded-lg shadow-sm border border-transparent w-64 md:w-full flex-shrink-0 md:flex-shrink-1 transition-shadow duration-200 hover:shadow-md ${
                isDesktop ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
        >
            <h3 className="font-semibold text-foreground-primary mb-2 truncate">{task.title}</h3>
            {task.projects?.name && (
                <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full inline-block mb-3">{task.projects?.name}</p>
            )}

            <div className="flex items-center justify-between text-xs text-foreground-secondary">
                <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{formattedDueDate}</span>
                </div>
                <div className={`flex items-center space-x-1 font-medium ${priority.color}`}>
                    <Flag size={14} />
                    <span>{priority.text}</span>
                </div>
            </div>
        </div>
    );
}
