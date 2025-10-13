import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

import {
    ArrowLeft,
    Edit,
    Calendar,
    DollarSign,
    Info,
    CheckCircle,
    PauseCircle,
    Clock,
    Archive
} from 'lucide-react';

// Importamos el Client Component para mostrar las tareas del proyecto
import TaskOverview from '@/app/components/tasks/TaskOverviw'; // Importamos el Client Component
// Importa el tipo Project si lo tienes definido
import type { Project } from '@/lib/types';

// Extendemos el tipo Project para incluir el nombre del cliente
export interface ProjectDetails extends Project {
    // Propiedades adicionales del cliente obtenidas con .select('*, clients(name)')
    clients?: {
        name: string;
    } | null;
}

export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {


    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const params = await props.params;
    if (!params.id) {
        notFound(); // 404 si no hay ID en los parámetros
    }
    const id = params.id;

    // Obtener los detalles del proyecto y el nombre del cliente
    const { data: project, error } = await supabase
        .from('projects')
        .select('*, clients(name)') // Seleccionamos el proyecto y el nombre del cliente relacionado
        .eq('id', id)
        .eq('user_id', user.id) // Aseguramos que el usuario solo vea sus propios proyectos
        .single();

    if (error || !project) {
        if (error && error.code === 'PGRST116') { // PGRST116 = No rows found
            notFound(); // 404 si el proyecto no existe o no pertenece al usuario
        }
        console.error('Error fetching project details:', error);
        // Podrías redirigir a una página de error o mostrar un mensaje
        redirect('/dashboard/projects?error=failed_to_load_project');
    }

    // Helper para obtener el icono y el color del estado
    const getStatusDisplay = (status: ProjectDetails['status']) => {
        switch (status) {
            case 'in_progress': return { icon: <Clock size={20} className="text-blue-500" />, color: 'text-blue-500', text: 'En Progreso' };
            case 'completed': return { icon: <CheckCircle size={20} className="text-green-500" />, color: 'text-green-500', text: 'Finalizado' };
            case 'pending': return { icon: <PauseCircle size={20} className="text-yellow-500" />, color: 'text-yellow-500', text: 'Pendiente' };
            case 'in_pause': return { icon: <PauseCircle size={20} className="text-orange-500" />, color: 'text-orange-500', text: 'En Pausa' };
            default: return { icon: <Info size={20} className="text-gray-400" />, color: 'text-gray-400', text: status };
        }
    };

    const statusDisplay = getStatusDisplay(project.status);
    const formattedDueDate = new Date(project.due_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedBudget = project.budget ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(project.budget) : 'No especificado';

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Encabezado del Proyecto */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/projects" className="text-foreground-secondary hover:text-primary transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl font-extrabold text-foreground-primary">{project.name}</h1>
                </div>
                <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <Edit size={18} className="mr-2" /> Editar Proyecto
                </Link>
            </div>

            {/* Información General del Proyecto */}
            <div className="bg-background-secondary p-8 rounded-lg shadow-md space-y-6 animate-fade-in-down animation-delay-100">
                <h2 className="text-2xl font-bold text-foreground-primary border-b border-gray-200 pb-4 flex items-center space-x-2">
                    <Info size={24} className="text-primary" />
                    <span>Detalles del Proyecto</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground-secondary">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Cliente:</p>
                        <p className="text-lg font-semibold">{project.clients?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Estado:</p>
                        <p className={`text-lg font-semibold flex items-center space-x-2 ${statusDisplay.color}`}>
                            {statusDisplay.icon}
                            <span>{statusDisplay.text}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Fecha de Entrega:</p>
                        <p className="text-lg font-semibold flex items-center space-x-2">
                            <Calendar size={20} className="text-secondary" />
                            <span>{formattedDueDate}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Presupuesto:</p>
                        <p className="text-lg font-semibold flex items-center space-x-2">
                            <DollarSign size={20} className="text-secondary" />
                            <span>{formattedBudget}</span>
                        </p>
                    </div>
                </div>
                {project.description && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <p className="text-sm font-medium text-gray-500">Descripción:</p>
                        <p className="text-foreground-primary mt-2 leading-relaxed">{project.description}</p>
                    </div>
                )}
            </div>

            {/* Componente de Tareas */}
            <TaskOverview projectId={project.id} />
        </div>
    );
}