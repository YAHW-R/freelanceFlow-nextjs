'use server'

import { createClient } from "@/lib/supabase/server";
import { Task, Project, Client, TimeEntries, Profile } from "@/lib/types";

export const getFullData = async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No hay usuario autenticado. Redirigiendo al login.");

    // Usamos Promise.all para ejecutar todas las consultas en paralelo
    const [profileResponse, projectsResponse, tasksResponse, clientsResponse, timeEntriesResponse] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("tasks").select("*, projects(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("clients").select("*").eq("user_id", user.id).order("name", { ascending: true }),
        supabase.from("time_entries").select("*").eq("user_id", user.id).order("entry_date", { ascending: false }),
    ]);

    // Manejo de errores centralizado
    const errors = [
        profileResponse.error,
        projectsResponse.error,
        tasksResponse.error,
        clientsResponse.error,
        timeEntriesResponse.error,
    ].filter(Boolean);

    if (errors.length > 0) {
        console.error("Error fetching full data:", errors);
        // Puedes decidir si lanzar un error o devolver datos parciales
        throw new Error("No se pudieron obtener todos los datos del usuario.");
    }

    // Devolvemos un objeto con todos los datos
    return {
        profile: profileResponse.data as Profile,
        projects: projectsResponse.data as Project[],
        tasks: tasksResponse.data as Task[],
        clients: clientsResponse.data as Client[],
        timeEntries: timeEntriesResponse.data as TimeEntries[],
    };
};