import { Project, ProjectStatus, ClientOptions } from '@/lib/types';
import ProjectKanbanCard from './ProjectKanbanCard';

interface ProjectKanbanColumnProps {
    status: ProjectStatus;
    projects: Project[];
    clients: ClientOptions[];
}

const statusConfig = {
    pending: { title: 'Pendiente', color: 'bg-yellow-500' },
    in_progress: { title: 'En Progreso', color: 'bg-blue-500' },
    in_pause: { title: 'En Pausa', color: 'bg-orange-500' },
    completed: { title: 'Completado', color: 'bg-green-500' },
};

export default function ProjectKanbanColumn({ status, projects, clients }: ProjectKanbanColumnProps) {
    const config = statusConfig[status] || { title: status, color: 'bg-gray-400' };

    return (
        <div className="flex flex-col md:w-80 flex-shrink-0 rounded-lg">
            {/* Header for the column (now a row on mobile) */}
            <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${config.color}`}></span>
                    <h2 className="font-semibold text-foreground-primary">{config.title}</h2>
                </div>
                <span className="text-sm font-medium text-foreground-secondary bg-background-secondary px-2 py-1 rounded-full">
                    {projects.length}
                </span>
            </div>
            {/* List of projects (horizontal on mobile, vertical on desktop) */}
            <div className="flex flex-row space-x-4 overflow-x-auto custom-scrollbar pb-4 md:flex-col md:space-x-0 md:space-y-4 md:overflow-y-auto md:h-full md:pr-2">
                {projects.map(project => (
                    <ProjectKanbanCard
                        key={project.id}
                        project={project}
                        clientName={clients.find(c => c.id === project.client_id)?.name || 'N/A'}
                    />
                ))}
                {/* Add a spacer for mobile to ensure padding on the right */}
                <div className="md:hidden flex-shrink-0 w-1"></div>
            </div>
        </div>
    );
}
