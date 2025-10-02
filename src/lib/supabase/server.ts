// Para Componentes de Servidor, Rutas API, Server Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Se llama desde un Componente de Servidor, donde no se pueden setear cookies.
                        // Esto se puede ignorar si tienes el middleware refrescando la sesión.
                    }
                },
                remove(name: string, options) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // Se llama desde un Componente de Servidor, donde no se pueden setear cookies.
                    }
                },
            },
        }
    );
}