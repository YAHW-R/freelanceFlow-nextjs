// @/app/components/tasks/TaskKanbanCard.tsx

import { TaskWithProjectName, TaskPriority } from '@/lib/types';
import { Calendar, Flag } from 'lucide-react';

interface TaskKanbanCardProps {
    task: TaskWithProjectName;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
}

const priorityConfig: Record<string, { color: string; text: string }> = {
    'Baja': { color: 'text-green-500', text: 'Baja' },
    'Media': { color: 'text-yellow-500', text: 'Media' },
    'Alta': { color: 'text-red-500', text: 'Alta' },
};

export default function TaskKanbanCard({ task, onDragStart }: TaskKanbanCardProps) {
    const formattedDueDate = task.due_date
        ? new Date(task.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        : 'N/A';

    const priority = priorityConfig[task.priority] || { color: 'text-gray-400', text: task.priority };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing transition-shadow duration-200 hover:shadow-md"
        >
            <h3 className="font-semibold text-foreground-primary mb-2">{task.title}</h3>
            {task.project_name && (
                <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full inline-block mb-3">{task.project_name}</p>
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