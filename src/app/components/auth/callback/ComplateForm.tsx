// app/auth/callback/CompleteProfileForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Cliente de componente
import { Bot, User, Phone } from 'lucide-react';
interface CompleteProfileFormProps {
    userEmail: string; // Para mostrarlo o pre-llenarlo
}

export default function CompleteProfileForm({ userEmail }: CompleteProfileFormProps) {
    const [username, setUsername] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!username.trim()) {
            setError('El nombre de usuario es requerido.');
            setIsLoading(false);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('No hay usuario autenticado.');
            }

            // 1. Verificar si el username ya existe (es buena práctica)
            const { data: existingUser, error: usernameCheckError } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username.trim())
                .neq('id', user.id); // Excluir al propio usuario por si ya tiene ese username

            if (usernameCheckError) throw usernameCheckError;
            if (existingUser && existingUser.length > 0) {
                setError('Ese nombre de usuario ya está en uso. Por favor, elige otro.');
                setIsLoading(false);
                return;
            }

            // 2. Actualizar el perfil del usuario
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    username: username.trim(),
                    full_name: fullName.trim() || null, // Guardar null si está vacío
                    phone_number: phoneNumber.trim() || null,
                    bio: bio.trim() || null,
                    updated_at: new Date().toISOString(), // Actualizar la fecha de modificación
                })
                .eq('id', user.id);

            if (updateError) {
                throw updateError;
            }

            router.refresh(); // Refresca los Server Components para que detecten el perfil completo
            router.push('/dashboard'); // Redirige al dashboard
        } catch (err: unknown) {
            console.error('Error al completar perfil:', err);
            if (err instanceof Error) {
                setError(err.message || 'Error al actualizar el perfil. Inténtalo de nuevo.');
            } else {
                setError('Error al actualizar el perfil. Inténtalo de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg rounded-lg bg-background-secondary p-8 shadow-md animate-fade-in-up">
            <div className="mb-6 flex flex-col items-center">
                <Bot size={48} className="text-primary mb-2" />
                <h2 className="text-3xl font-bold text-foreground-primary">Completa tu Perfil</h2>
                <p className="mt-2 text-foreground-secondary text-center">
                    ¡Bienvenido a ProjectFlow! Para continuar, necesitamos algunos datos más.
                    <br />Tu email: <span className="font-medium text-primary">{userEmail}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-foreground-secondary">
                        Nombre de Usuario <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                            <User size={16} />
                        </span>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            required
                            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="nombredeusuario"
                            aria-describedby="username-help"
                        />
                    </div>
                    <p id="username-help" className="mt-1 text-xs text-gray-500">
                        Será tu identificador público en la plataforma.
                    </p>
                </div>

                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground-secondary">
                        Nombre Completo
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                            <User size={16} />
                        </span>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={fullName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground-secondary">
                        Teléfono
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                            <Phone size={16} />
                        </span>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="+34 600 123 456"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-foreground-secondary">
                        Biografía
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={bio}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="Cuéntanos un poco sobre ti y tus habilidades..."
                        ></textarea>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600 animate-fade-in">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Guardando...' : 'Completar Perfil'}
                </button>
            </form>
        </div>
    );
}