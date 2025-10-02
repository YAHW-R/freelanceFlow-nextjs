// app/auth/callback/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Cliente de servidor
import CompleteProfileForm from '@/app/components/auth/callback/ComplateForm'; // El Client Component que crearemos

export default async function AuthCallbackPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Si no hay usuario autenticado, redirigir al login.
        // Esto es común si alguien accede directamente a /auth/callback sin una sesión activa.
        redirect('/login');
    }

    // Ahora, intentamos obtener el perfil del usuario de nuestra tabla 'profiles'
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = No rows found (el perfil no existe, lo cual es manejable)
        console.error('Error al obtener el perfil del usuario:', profileError);
        // Podrías redirigir a una página de error o al dashboard con un mensaje
        redirect('/dashboard?error=profile_fetch_failed');
    }

    // Verificar si los datos requeridos ya están completos
    // Asumimos que 'username' es el único campo requerido por ahora
    const isProfileComplete = profile && profile.username; // El username DEBE existir si el perfil existe

    if (isProfileComplete) {
        // Si el perfil está completo, redirigir al dashboard
        redirect('/dashboard');
    }

    // Si el perfil no existe o no está completo, mostramos el formulario
    return (
        <div className="flex min-h-screen items-center justify-center bg-background-primary p-4 pt-16">
            <CompleteProfileForm userEmail={user.email || ''} />
        </div>
    );
}