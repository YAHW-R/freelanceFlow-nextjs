import { ProjectStatus, TaskStatus, createAiType } from "./types"

export const PROJECT_STATUS_MAP: Readonly<Record<ProjectStatus, string>> = {
    in_pause: 'En pausa',
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completado',
}

export const PROJECT_STATUS_ARRAY: ProjectStatus[] = Object.keys(PROJECT_STATUS_MAP) as ProjectStatus[]


export const TASK_STATUS_MAP: Readonly<Record<TaskStatus, string>> = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completada',
}

export const TASK_STATUS_ARRAY: TaskStatus[] = Object.keys(TASK_STATUS_MAP) as TaskStatus[]

//Ai

export const CREATE_TYPE_ARRAY: createAiType[] = ['task', 'project', 'client']