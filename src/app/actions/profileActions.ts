'use server'

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/actions/authActions'

import type { Profile, UpdateProfileFormData } from '@/lib/types';

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


    return { ...data, email: user.email } as Profile;
}

export async function updateUserProfile(profileData: UpdateProfileFormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        console.error('No user found');
        redirect('/login');
    }

    // Convierte la cadena de habilidades en un array de strings
    const skillsArray = profileData.skills ? profileData.skills.split(',').map(skill => skill.trim()) : null;

    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username: profileData.username,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        bio: profileData.bio,
        skills: skillsArray,
        updated_at: new Date().toISOString(),
    });

    if (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update profile');
    }

    redirect('/dashboard/profile');
}

export async function uploadProfielImage(image: File) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        console.error('No user found');
        redirect('/login');
    }

    if (!image) {
        throw new Error('No file provided');
    }

    const fileExt = image.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, image, {
            cacheControl: '3600',
            upsert: true,
        });

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error('Failed to upload image');
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    return data.publicUrl;
}

export async function changePassword(newPassword: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    if (newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        console.error('Error al cambiar contraseña:', error);
        throw new Error('No se pudo cambiar la contraseña: ' + error.message);
    }

    await signOut()
    return { success: true };
}


export async function deleteAccount() { }

export async function signOutAllDevices() { }