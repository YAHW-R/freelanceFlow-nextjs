// app/components/types.ts o app/lib/types.ts

export type ProjectStatus = 'in_progress' | 'completed' | 'pending' | 'in_pause';

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
    billing_type: 'hourly' | 'fixed_price';
    created_at: string;
}

export interface Profile {
    id: string;
    username: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    bio?: string;
    skills?: string[];
    subcirption_plan?: string;
    location?: string;
    updated_at?: string;
    total_income?: number;
    monthly_icome?: number;
    created_at: string;
}
export interface UpdateProfileFormData {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    skills: string | null;
    bio: string | null;
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

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'Baja' | 'Media' | 'Alta';

export interface Task {
    id: string;
    project_id: string;
    user_id: string;
    title: string;
    description?: string;
    status: TaskStatus | string;
    priority: TaskPriority | string;
    due_date: string;
    updated_at?: string;
    created_at: string;
}

export interface TaskWithProjectName extends Task {
    project_name?: string;
}


export interface TimeEntries {
    id: string;
    user_id: string;
    project_id: string;
    task_id: string;
    description?: string;
    duration_seconds: number;
    entry_date: string;
    created_at: string;
}