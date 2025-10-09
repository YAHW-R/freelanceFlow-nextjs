// app/(dashboard)/profile/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Info, Edit, User, Star } from 'lucide-react';
import { getUserProfile } from '@/app/actions/profileActions';
import { Profile } from '@/lib/types'; // Importa la Server Action

export default async function ProfilePage() {
    const userProfile: Profile | null = await getUserProfile();

    if (!userProfile) {
        // Esto podría ocurrir si hay un error grave o el usuario no está autenticado
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-red-600">
                <p className="text-xl font-medium">Error al cargar el perfil. Por favor, intenta de nuevo.</p>
                <Link href="/login" className="mt-4 text-primary hover:underline">Ir a Iniciar Sesión</Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Mi Perfil</h1>
                <Link
                    href="/dashboard/profile/edit"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <Edit size={18} className="mr-2" /> Editar Perfil
                </Link>
            </div>

            {/* Tarjeta de Perfil */}
            <div className="bg-background-secondary rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-md">
                    {userProfile.avatar_url ? (
                        <Image
                            src={userProfile.avatar_url}
                            alt="Avatar del Usuario"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                        />
                    ) : (
                        <User size={100} className="rounded-full bg-background-secondary p-1 text-foreground-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                </div>

                {/* Nombre de Usuario y Nombre Completo */}
                <h2 className="mt-6 text-3xl font-bold text-foreground-primary">{userProfile.full_name || userProfile.username || 'Usuario'}</h2>
                <p className="text-lg text-foreground-secondary">@{userProfile.username || 'sin-usuario'}</p>

                {/* Biografía */}
                {userProfile.bio && (
                    <p className="mt-4 text-md text-foreground-secondary max-w-prose text-left self-start w-full">
                        <Info size={16} className="inline mr-2 text-primary" />
                        {userProfile.bio}
                    </p>
                )}

                {/* Habilidades */}
                {userProfile.skills && userProfile.skills.length > 0 && (
                    <div className="mt-6 w-full">
                        <h3 className="text-lg font-semibold text-foreground-primary text-left mb-3 flex items-center">
                            <Star size={18} className="mr-2 text-primary" /> Habilidades
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-start">
                            {userProfile.skills.map((skill) => (
                                <span key={skill} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Información de Contacto/Web */}
                <div className="mt-6 flex flex-col space-y-3 text-foreground-secondary w-full max-w-sm">
                    {/* Email (generalmente no se muestra directamente por seguridad, pero puedes añadirlo si lo tienes en el perfil) */}
                    {/* <p className="flex items-center justify-center text-sm">
            <Mail size={16} className="mr-2 text-secondary" /> {userProfile.email || 'No disponible'}
          </p> */}
                    {userProfile.updated_at && (
                        <p className="text-xs text-gray-500 mt-2">
                            Última actualización: {new Date(userProfile.updated_at).toLocaleDateString('es-ES', { dateStyle: 'medium' })}
                        </p>
                    )}
                </div>
            </div>

            {/* Puedes añadir más secciones aquí, como proyectos destacados, clientes, etc. */}
        </div>
    );
}