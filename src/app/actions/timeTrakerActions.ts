'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { TimeEntries } from "@/lib/types";

export async function createTimeEntry(payload: Omit<TimeEntries, 'id' | 'user_id' | 'created_at'>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado.");
    }

    const { data, error } = await supabase
        .from('time_entries')
        .insert({
            user_id: user.id,
            project_id: payload.project_id,
            task_id: payload.task_id,
            description: payload.description,
            duration_minutes: payload.duration_minutes,
            entry_date: payload.entry_date,
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating time entry:", error);
        throw new Error("No se pudo guardar el registro de tiempo.");
    }

    revalidatePath('/dashboard/time-traker');
    return data;
}


export async function getTimeEntries(
    { from, to }: { from: string, to: string }
): Promise<TimeEntries[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado.");

    const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', from)
        .lte('entry_date', to);

    if (error) {
        console.error("Error fetching time entries:", error);
        throw new Error("No se pudieron obtener los registros de tiempo.");
    }
    return data || [];
}
