// app/components/types.ts o app/lib/types.ts

export type ProjectStatus = 'En Progreso' | 'Finalizado' | 'Pendiente' | 'Archivado' | 'En Pausa';

export interface Project {
    id: string;
    name: string;
    clientName: string;
    status: ProjectStatus;
    progress: number; // Porcentaje de 0 a 100
    dueDate: string; // Formato ISO 8601 string (e.g., "YYYY-MM-DD")
    // Puedes añadir más campos si los necesitas, como descripción, presupuesto, etc.
    description?: string;
    budget?: number;
}