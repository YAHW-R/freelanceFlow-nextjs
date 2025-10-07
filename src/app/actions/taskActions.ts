'use server'

import { createClient } from "@/lib/supabase/server"

import type { Task, TaskWithProjectName } from "@/lib/types"

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