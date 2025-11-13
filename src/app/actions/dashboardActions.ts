'use server'

import { createClient } from "@/lib/supabase/server"

export async function fetchDashboardData() {
    const supabase = await createClient()

    const user = supabase.auth.getUser()
    if (!user) {
        throw new Error('User not authenticated')
    }
    const userId = (await user).data.user?.id
    if (!userId) {
        throw new Error('User ID not found')
    }

    // Fetch projects
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*, goals(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (projectsError) {
        console.error('Error fetching projects:', projectsError)
        throw new Error('Could not fetch projects')
    }

    // Fetch clients
    const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true })

    if (clientsError) {
        console.error('Error fetching clients:', clientsError)
        throw new Error('Could not fetch clients')
    }

    // Fetch tasks
    const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (tasksError) {
        console.error('Error fetching tasks:', tasksError)
        throw new Error('Could not fetch tasks')
    }

    return { projects, clients, tasks }
}