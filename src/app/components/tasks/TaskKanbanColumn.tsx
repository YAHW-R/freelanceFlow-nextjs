import { TaskWithProjectName, TaskStatus } from '@/lib/types';
import TaskKanbanCard from './TaskKanbanCard';

interface TaskKanbanColumnProps {
    status: TaskStatus;
    tasks: TaskWithProjectName[];
    onTaskDragStart: (e: React.DragEvent, taskId: string) => void;
    onColumnDragOver: (e: React.DragEvent) => void;
    onColumnDragLeave: (e: React.DragEvent) => void;
    onColumnDrop: (e: React.DragEvent, newStatus: TaskStatus) => void;
}

const statusConfig = {
    pending: { title: 'Pendiente', color: 'bg-yellow-500' },
    in_progress: { title: 'En Progreso', color: 'bg-blue-500' },
    completed: { title: 'Completada', color: 'bg-green-500' },
};

export default function TaskKanbanColumn({
    status,
    tasks,
    onTaskDragStart,
    onColumnDragOver,
    onColumnDragLeave,
    onColumnDrop,
}: TaskKanbanColumnProps) {
    const config = statusConfig[status] || { title: status, color: 'bg-gray-400' };

    return (
        // The main container for a column. On mobile, this is a full-width row.
        <div
            className="flex flex-col md:w-80 flex-shrink-0 rounded-lg"
            onDragOver={onColumnDragOver}
            onDragLeave={onColumnDragLeave}
            onDrop={(e) => onColumnDrop(e, status)}
        >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1 md:px-2">
                <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${config.color}`}></span>
                    <h2 className="font-semibold text-foreground-primary">{config.title}</h2>
                </div>
                <span className="text-sm font-medium text-foreground-secondary bg-background-secondary px-2 py-1 rounded-full">
                    {tasks.length}
                </span>
            </div>
            {/* Cards Container: horizontal on mobile, vertical on desktop */}
            <div className="flex flex-row md:flex-col md:space-y-4 space-x-4 md:space-x-0 overflow-x-auto md:overflow-y-auto custom-scrollbar md:h-full p-1 md:p-0 md:pr-2">
                {tasks.map(task => (
                    <TaskKanbanCard
                        key={task.id}
                        task={task}
                        onDragStart={onTaskDragStart}
                    />
                ))}
                {/* Spacer for mobile to ensure padding on the right of the scroll */}
                <div className="md:hidden flex-shrink-0 w-1"></div>
            </div>
        </div>
    );
}