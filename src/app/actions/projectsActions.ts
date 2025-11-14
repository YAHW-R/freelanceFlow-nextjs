'use server'

import { createClient } from "@/lib/supabase/server";
import type { Project, Goal, ProjectFormData } from "@/lib/types";
import { redirect } from "next/navigation";


export async function getProjects() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data, error } = await supabase
        .from('projects')
        .select('*, goals(*)')
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


export async function createProject(projectData: ProjectFormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { goals, ...projectDetails } = projectData;

    // 1. Crear el proyecto
    const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert([{ ...projectDetails, user_id: user.id, progress: 0 }])
        .select()
        .single();

    if (projectError) {
        throw new Error(`Error creating project: ${projectError.message}`);
    }

    if (!newProject) {
        throw new Error('Failed to create project, no data returned.');
    }

    // 2. Si hay objetivos, crearlos y asociarlos al proyecto
    if (goals && goals.length > 0) {
        const goalsToInsert = goals.map(goal => ({
            name: goal.name,
            description: goal.description,
            project_id: newProject.id,
            is_complete: false,
        }));

        const { error: goalsError } = await supabase
            .from('goals')
            .insert(goalsToInsert);

        if (goalsError) {
            // Si falla la inserción de objetivos, hacemos un rollback eliminando el proyecto
            await supabase.from('projects').delete().eq('id', newProject.id);
            throw new Error(`Project creation failed during goal insertion: ${goalsError.message}. The project has been rolled back.`);
        }
    }

    return newProject;
}

export async function getProjectById(projectId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: project, error } = await supabase
        .from('projects')
        .select('*, goals(*), clients(name)') // Select goals and client name
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // No rows found
            return null;
        }
        throw new Error(`Error fetching project: ${error.message}`);
    }

    return project as Project;
}

// Tipos para la actualización de proyectos
type UpdateGoalData = Goal; // Goals coming from the form will have an ID if they are existing
type UpdateProjectData = Omit<Project, 'created_at' | 'user_id' | 'progress' | 'goals'> & {
    goals?: UpdateGoalData[];
};

export async function updateProject(projectId: string, projectData: UpdateProjectData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Separate goals from the rest of the project data
    const { goals: updatedGoals, ...projectDetails } = projectData;

    // 1. Update the project's main fields
    const { error: projectError } = await supabase
        .from('projects')
        .update(projectDetails)
        .eq('id', projectId)
        .eq('user_id', user.id); // Ensure user owns the project

    if (projectError) {
        throw new Error(`Error updating project: ${projectError.message}`);
    }

    // 2. Handle goals
    // Fetch current goals to compare
    const { data: currentGoals, error: fetchGoalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('project_id', projectId);

    if (fetchGoalsError) {
        throw new Error(`Error fetching current goals for update: ${fetchGoalsError.message}`);
    }

    const currentGoalIds = new Set(currentGoals.map(g => g.id));
    const updatedGoalIds = new Set(updatedGoals?.map(g => g.id).filter(Boolean) || []); // Filter out undefined/null for new goals

    // Goals to delete: present in currentGoals but not in updatedGoals
    const goalsToDelete = currentGoals.filter(g => !updatedGoalIds.has(g.id));
    if (goalsToDelete.length > 0) {
        const { error: deleteError } = await supabase
            .from('goals')
            .delete()
            .in('id', goalsToDelete.map(g => g.id));
        if (deleteError) {
            throw new Error(`Error deleting goals: ${deleteError.message}`);
        }
    }

    // Goals to insert/update
    if (updatedGoals && updatedGoals.length > 0) {
        const goalsToInsert = updatedGoals.filter(g => !currentGoalIds.has(g.id));
        const goalsToUpdate = updatedGoals.filter(g => currentGoalIds.has(g.id));

        // Insert new goals
        if (goalsToInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('goals')
                .insert(goalsToInsert.map(g => ({
                    name: g.name,
                    description: g.description,
                    project_id: projectId,
                })));
            if (insertError) {
                throw new Error(`Error inserting new goals: ${insertError.message}`);
            }
        }

        // Update existing goals
        for (const goal of goalsToUpdate) {
            const { error: updateGoalError } = await supabase
                .from('goals')
                .update({ name: goal.name, description: goal.description })
                .eq('id', goal.id)
                .eq('project_id', projectId); // Ensure goal belongs to this project
            if (updateGoalError) {
                throw new Error(`Error updating goal ${goal.id}: ${updateGoalError.message}`);
            }
        }
    }

    // Return the updated project or just a success message

    return { success: true, message: 'Project updated successfully.' };

}



export async function updateGoalStatus(goalId: string, isComplete: boolean, projectId: string) {

    const supabase = await createClient();

    const { error } = await supabase

        .from('goals')

        .update({ is_complete: isComplete })

        .eq('id', goalId);



    if (error) {

        throw new Error(`Error updating goal status: ${error.message}`);

    }



    // After updating a goal, recalculate and update the project's progress

    const { data: projectGoals, error: goalsError } = await supabase

        .from('goals')

        .select('is_complete')

        .eq('project_id', projectId);



    if (goalsError) {

        throw new Error(`Error fetching goals to recalculate progress: ${goalsError.message}`);

    }



    const completedGoals = projectGoals.filter(goal => goal.is_complete).length;

    const totalGoals = projectGoals.length;

    const newProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;



    await updateProjectProgress(projectId, newProgress);

}

