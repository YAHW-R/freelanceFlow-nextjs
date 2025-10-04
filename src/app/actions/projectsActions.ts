'use server'

import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { redirect } from "next/navigation";


export async function getProjects() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error fetching projects: ${error.message}`);
    }

    return data as Project[];
}

export async function deleteProject(projectId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

    if (error) {
        throw new Error(`Error deleting project: ${error.message}`);
    }
}

export async function updateProjectStatus(projectId: string, newStatus: Project['status']) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

    if (error) {
        throw new Error(`Error updating project status: ${error.message}`);
    }
}

export async function updateProjectProgress(projectId: string, newProgress: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('projects')
        .update({ progress: newProgress })
        .eq('id', projectId);

    if (error) {
        throw new Error(`Error updating project progress: ${error.message}`);
    }
}

export async function createProject(projectData: Omit<Project, 'id' | 'created_at' | 'user_id' | 'progress'>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, created_at: new Date().toISOString(), user_id: user.id, progress: 0 }])
        .select()
        .single();

    if (error) {
        throw new Error(`Error creating project: ${error.message}`);
    }

    return data;
}