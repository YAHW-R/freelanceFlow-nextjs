// @/app/components/kanban/KanbanColumn.tsx

import { Task, TaskStatus } from '@/lib/types'; // Usa tus tipos globales
import KanbanTaskCard from './KanbanTaskCard';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus; // El estado que representa esta columna
  tasks: Task[];
  onTaskDragStart: (e: React.DragEvent, taskId: string) => void;
  onColumnDragOver: (e: React.DragEvent) => void;
  onColumnDrop: (e: React.DragEvent, newStatus: TaskStatus) => void;
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  onTaskDragStart,
  onColumnDragOver,
  onColumnDrop,
}: KanbanColumnProps) {
  return (
    <div
      className="flex-shrink-0 w-80 bg-background rounded-lg shadow-md flex flex-col overflow-hidden animate-fade-in-up"
      onDragOver={onColumnDragOver}
      onDrop={(e) => onColumnDrop(e, status)}
      onDragLeave={(e) => {
        // Opcional: Remover estilos de "drag-over"
        e.currentTarget.classList.remove('border-primary-hover', 'border-2');
      }}
      onDragEnter={(e) => {
        // Opcional: Añadir estilos de "drag-over"
        e.currentTarget.classList.add('border-primary-hover', 'border-2');
      }}
    >
      <div className="p-4 border-b border-gray-200 bg-background-secondary flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-lg font-bold text-foreground-primary">{title} ({tasks.length})</h2>
        <Link href={`/dashboard/tasks/new?status=${status}`} className="text-primary hover:text-primary-hover" title={`Añadir tarea a ${title}`}>
          <PlusCircle size={20} />
        </Link>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} onDragStart={onTaskDragStart} />
          ))
        ) : (
          <p className="text-center text-foreground-secondary text-sm italic py-4">
            No hay tareas en esta columna.
          </p>
        )}
      </div>
    </div>
  );
}