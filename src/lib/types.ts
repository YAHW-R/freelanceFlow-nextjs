// app/components/types.ts o app/lib/types.ts

export type ProjectStatus = 'En Progreso' | 'Finalizado' | 'Pendiente' | 'Archivado' | 'En Pausa';

export interface Project {
    id: string;
    name: string;
    client_id: string;
    user_id: string;
    status: ProjectStatus;
    progress: number;
    description?: string;
    budget?: number;
    start_data?: string;
    due_date?: string;
    hourly_rate?: number;
    created_at: string;
}

export interface Profile {
    id: string;
    username: string;
    fullname: string;
    email: string;
    avatar_url?: string;
    bio?: string;
    skills?: string;
    subcirption_plan?: string;
    location?: string;
}

export interface Client {
    id: string;
    name: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    company?: string;
    user_id: string;
    created_at: string;
}

export interface ClientOptions {
    id: string;
    name: string;
}

export interface Task {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    status: 'To Do' | 'In Progress' | 'Done';
    due_date?: string;
    created_at: string;
}