'use server'

import { createClient } from "@/lib/supabase/server"

import type { Task, TaskWithProjectName } from "@/lib/types"
import { redirect } from "next/navigation"

export async function getTasksUser() {
    const supabase = await createClient()
    const user = supabase.auth.getUser()
    if (!user) {
        throw new Error('User not authenticated')
    }
    const userId = (await user).data.user?.id
    if (!userId) {
        throw new Error('User ID not found')
    }



    const { data, error } = await supabase
        .from('tasks')
        .select('*, projects(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })


    if (error) {
        console.error('Error fetching tasks:', error)
        return []
    }


    return data as TaskWithProjectName[]
}


export async function updateTaskStatus(taskId: string, newStatus: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)
        .select()
        .single()

    if (error) {
        console.error('Error updating task status:', error)
        throw error
    }

    return data as Task
}


export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'user_id'>) {
    const supabase = await createClient()
    const user = supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }
    const userId = (await user).data.user?.id
    if (!userId) {
        throw new Error('User ID not found')
    }

    const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, user_id: userId })
        .select()
        .single()

    if (error) {
        console.error('Error creating task:', error)
        throw error
    }

    return data as Task
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado.");

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching tasks by project:", error);
        throw new Error("No se pudieron obtener las tareas del proyecto.");
    }
    return data || [];
}
