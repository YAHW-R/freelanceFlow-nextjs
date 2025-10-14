'use server';

import { createClient } from "@/lib/supabase/server";
import { Client } from "@/lib/types";

export async function getClients() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No hay usuario autenticado. Redirigiendo al login.');

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    return data;
}

export async function getClientById(clientId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No hay usuario autenticado. Redirigiendo al login.');

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error('Error fetching client by ID:', error);
        return null;
    }
    return data as Client;
}

export async function createClientOfUser(clientData: { name: string; contact_person?: string; email?: string; phone?: string; notes?: string; }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No hay usuario autenticado. Redirigiendo al login.');

    const { data, error } = await supabase.from('clients').insert({ ...clientData, user_id: user.id }).select().single();
    if (error) throw new Error(error.message);
    return data as Client;
}