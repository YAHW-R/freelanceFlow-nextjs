'use server'

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function getUserProfile() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        console.error('No user found');
        redirect('/login');
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !data) {
        console.error('Error fetching user profile:', error);
        redirect('/login');
    }


    return { ...data, email: user.email };
}