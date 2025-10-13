// @/app/actions/metricsActions.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface ProjectBudgetMetrics {
    projectId: string;
    projectName: string;
    billingType: 'hourly' | 'fixed_price' | 'none';
    totalBudgetAmount: number | null; // Solo para fixed_price o límite para hourly
    hourlyRate: number | null; // Solo para hourly
    totalHoursWorked: number; // en horas
    totalCostIncurred: number; // Suma de cost_incurred
    budgetRemaining: number | null; // totalBudgetAmount - totalCostIncurred
    budgetUsedPercentage: number | null; // (totalCostIncurred / totalBudgetAmount) * 100
    tasks: Array<{
        taskId: string;
        taskName: string;
        budgetAllocatedAmount: number | null; // Solo para fixed_price tasks
        hoursWorkedOnTask: number;
        costIncurredOnTask: number;
        taskBudgetRemaining: number | null;
        taskBudgetUsedPercentage: number | null;
    }>;
}

export async function getProjectBudgetMetrics(projectId: string): Promise<ProjectBudgetMetrics | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Obtener detalles del proyecto
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, name, billing_type, total_budget_amount, hourly_rate')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

    if (projectError || !project) {
        console.error('Error fetching project for metrics:', projectError);
        return null;
    }

    // Obtener todas las tareas del proyecto con su presupuesto asignado
    const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, name, budget_allocated_amount')
        .eq('project_id', projectId)
        .eq('user_id', user.id);

    if (tasksError) {
        console.error('Error fetching tasks for project metrics:', tasksError);
        return null;
    }

    // Obtener todos los registros de tiempo para el proyecto
    const { data: timeEntries, error: timeEntriesError } = await supabase
        .from('time_entries')
        .select('duration_minutes, cost_incurred, task_id')
        .eq('project_id', projectId)
        .eq('user_id', user.id);

    if (timeEntriesError) {
        console.error('Error fetching time entries for project metrics:', timeEntriesError);
        return null;
    }

    // Calcular métricas a nivel de proyecto
    const totalMinutesWorked = timeEntries.reduce((sum, entry) => sum + entry.duration_minutes, 0);
    const totalHoursWorked = totalMinutesWorked / 60;
    const totalCostIncurred = timeEntries.reduce((sum, entry) => sum + entry.cost_incurred, 0);

    let budgetRemaining: number | null = null;
    let budgetUsedPercentage: number | null = null;

    if (project.total_budget_amount !== null) {
        budgetRemaining = project.total_budget_amount - totalCostIncurred;
        if (project.total_budget_amount > 0) {
            budgetUsedPercentage = (totalCostIncurred / project.total_budget_amount) * 100;
        } else {
            budgetUsedPercentage = 0; // Si el presupuesto es 0, no se ha usado nada si el costo es 0
        }
    }

    // Calcular métricas por tarea
    const tasksWithMetrics = tasks.map(task => {
        const taskTimeEntries = timeEntries.filter(entry => entry.task_id === task.id);
        const hoursWorkedOnTask = taskTimeEntries.reduce((sum, entry) => sum + entry.duration_minutes, 0) / 60;
        const costIncurredOnTask = taskTimeEntries.reduce((sum, entry) => sum + entry.cost_incurred, 0);

        let taskBudgetRemaining: number | null = null;
        let taskBudgetUsedPercentage: number | null = null;

        if (project.billing_type === 'fixed_price' && task.budget_allocated_amount !== null) {
            taskBudgetRemaining = task.budget_allocated_amount - costIncurredOnTask;
            if (task.budget_allocated_amount > 0) {
                taskBudgetUsedPercentage = (costIncurredOnTask / task.budget_allocated_amount) * 100;
            } else {
                taskBudgetUsedPercentage = 0; // Si el presupuesto de la tarea es 0
            }
        }

        return {
            taskId: task.id,
            taskName: task.name,
            budgetAllocatedAmount: task.budget_allocated_amount,
            hoursWorkedOnTask,
            costIncurredOnTask,
            taskBudgetRemaining,
            taskBudgetUsedPercentage,
        };
    });

    return {
        projectId: project.id,
        projectName: project.name,
        billingType: project.billing_type,
        totalBudgetAmount: project.total_budget_amount,
        hourlyRate: project.hourly_rate,
        totalHoursWorked,
        totalCostIncurred,
        budgetRemaining,
        budgetUsedPercentage,
        tasks: tasksWithMetrics,
    };
}

// Ejemplo: Obtener resumen de horas por cliente para el dashboard
export interface ClientHoursSummary {
    clientId: string;
    clientName: string;
    totalHours: number;
    totalBillableHours: number;
    totalNonBillableHours: number;
    potentialEarnings: number;
}

export async function getClientHoursSummary(): Promise<ClientHoursSummary[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: clientData, error } = await supabase
        .from('clients')
        .select(`
      id,
      name,
      projects (
        id,
        billing_type,
        hourly_rate,
        time_entries (
          duration_minutes,
          cost_incurred,
          is_billable
        )
      )
    `)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching client hours summary:', error);
        return [];
    }

    const summary = clientData.map(client => {
        let totalHours = 0;
        let totalBillableHours = 0;
        let totalNonBillableHours = 0;
        let potentialEarnings = 0;

        client.projects.forEach(project => {
            project.time_entries.forEach(entry => {
                const hours = entry.duration_minutes / 60;
                totalHours += hours;
                potentialEarnings += entry.cost_incurred; // Ya calcula el valor monetario

                if (entry.is_billable) {
                    totalBillableHours += hours;
                } else {
                    totalNonBillableHours += hours;
                }
            });
        });

        return {
            clientId: client.id,
            clientName: client.name,
            totalHours: parseFloat(totalHours.toFixed(2)),
            totalBillableHours: parseFloat(totalBillableHours.toFixed(2)),
            totalNonBillableHours: parseFloat(totalNonBillableHours.toFixed(2)),
            potentialEarnings: parseFloat(potentialEarnings.toFixed(2)),
        };
    });

    return summary;
}