import Link from 'next/link';
import { MoreVertical, CheckCircle, Clock, PauseCircle, Archive } from 'lucide-react';
import type { ClientOptions, Project, ProjectStatus } from '@/lib/types';

// Función auxiliar para obtener el color del estado
const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case 'En Progreso':
            return 'bg-blue-100 text-blue-800';
        case 'Finalizado':
            return 'bg-green-100 text-green-800';
        case 'Pendiente':
            return 'bg-yellow-100 text-yellow-800';
        case 'Archivado':
            return 'bg-gray-100 text-gray-800';
        case 'En Pausa':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Función auxiliar para obtener el icono del estado
const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
        case 'En Progreso':
            return <Clock size={16} className="mr-1" />;
        case 'Finalizado':
            return <CheckCircle size={16} className="mr-1" />;
        case 'Pendiente':
            return <Clock size={16} className="mr-1" />; // Podrías usar un icono diferente si quieres
        case 'Archivado':
            return <Archive size={16} className="mr-1" />;
        case 'En Pausa':
            return <PauseCircle size={16} className="mr-1" />;
        default:
            return null;
    }
};

interface ProjectCardProps {
    project: Project;
    clients: ClientOptions[];
}

export default function ProjectCard({ project, clients }: ProjectCardProps) {
    // Calcular días restantes (simplificado)
    const today = new Date();
    const dueDate = new Date(project.due_date || 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isOverdue = diffDays < 0 && project.status !== 'Finalizado';
    const isDueSoon = diffDays > 0 && diffDays <= 7 && project.status !== 'Finalizado';

    const clientName = clients.find(client => client.id === project.client_id)?.name || 'Desconocido';


    return (
        <div className="relative rounded-lg bg-background-secondary p-6 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in-down">
            {/* Botón de opciones (el "•••") */}
            <button className="absolute right-4 top-4 text-foreground-secondary hover:text-primary transition-colors duration-200">
                <MoreVertical size={20} />
            </button>

            {/* Título del Proyecto y Cliente */}
            <Link href={`/dashboard/projects/${project.id}`} className="block">
                <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors duration-200">
                    {project.name}
                </h3>
                <p className="mt-1 text-sm text-foreground">Cliente: {clientName}</p>
            </Link>

            {/* Estado del Proyecto */}
            <div className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)}
                {project.status}
            </div>

            {/* Barra de Progreso */}
            <div className="mt-4">
                <div className="flex justify-between text-sm font-medium text-foreground mb-1">
                    <span>Progreso</span>
                    <span>{project.progress}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-foreground">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Fecha de Finalización */}
            <div className="mt-4 flex items-center justify-between text-sm text-foreground">
                <p>
                    Fecha de Entrega:{' '}
                    <span className={`font-medium ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : ''}`}>
                        {new Date(project.due_date || 0).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </p>
                {isOverdue && (
                    <span className="ml-2 text-xs font-semibold text-red-600 animate-pulse">¡Vencido!</span>
                )}
                {isDueSoon && (
                    <span className="ml-2 text-xs font-semibold text-orange-600 animate-subtle-pulse">Vence pronto ({diffDays} días)</span>
                )}
            </div>
        </div>
    );
}