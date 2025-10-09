// app/(dashboard)/profile/edit/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { getUserProfile, updateUserProfile, uploadProfielImage } from '@/app/actions/profileActions'; // Importa la Server Action
import { Profile, UpdateProfileFormData } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProfilePage() {


    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Para almacenar la imagen seleccionada

    // Estados del formulario
    const [username, setUsername] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [skills, setSkills] = useState<string>('');
    const [bio, setBio] = useState<string>('');

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            try {
                const userProfile = await getUserProfile();
                if (userProfile) {
                    setProfile(userProfile);
                    // Rellenar los campos del formulario con los datos existentes
                    setUsername(userProfile.username || '');
                    setFullName(userProfile.full_name || '');
                    setAvatarUrl(userProfile.avatar_url || '');
                    setSkills(userProfile.skills || '');
                    setBio(userProfile.bio || '');
                } else {
                    setError('No se pudo cargar tu perfil.');
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || 'Error al cargar el perfil.');
                    console.error('Error fetching profile for edit:', err);
                }
                else {
                    setError('Error desconocido al cargar el perfil.');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        // Si se ha seleccionado una nueva imagen, subirla a Supabase Storage
        if (selectedImage) {
            try {
                const url = await uploadProfielImage(selectedImage);

                setAvatarUrl(url); // Actualiza el estado con la URL de la imagen subida

            } catch (storageError: unknown) {
                if (storageError instanceof Error) {
                    setError(storageError.message || 'Error al subir la imagen.');
                } else {
                    setError('Error desconocido al subir la imagen.');
                }
                setIsSubmitting(false);
                return;
            }
        }
        try {
            const formData: UpdateProfileFormData = {
                username: username.trim() === '' ? null : username.trim(),
                full_name: fullName.trim() === '' ? null : fullName.trim(),
                avatar_url: avatarUrl.trim() === '' ? null : avatarUrl.trim(),
                skills: skills.trim() === '' ? null : skills.trim(),
                bio: bio.trim() === '' ? null : bio.trim(),
            };

            await updateUserProfile(formData);
            setSuccess('¡Perfil actualizado exitosamente!');
            // router.push('/dashboard/profile'); // Opcional: redirigir después de guardar
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Error desconocido al actualizar el perfil.');
            } else {
                setError('Error desconocido al actualizar el perfil.');
            }
        } finally {
            setIsSubmitting(false);

        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setSelectedImage(e.target.files[0]);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="mt-4 text-lg">Cargando datos de tu perfil...</p>
            </div>
        );
    }

    if (error && !profile) { // Si hay un error y no se pudo cargar ningún perfil
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-red-600">
                <p className="text-xl font-medium">{error}</p>
                <Link href="/dashboard/profile" className="mt-4 text-primary hover:underline">Volver al Perfil</Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8 animate-fade-in-up">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Editar Perfil</h1>
                <Link href="/dashboard/profile" className="text-sm font-medium text-primary hover:underline">
                    Volver al Perfil
                </Link>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 bg-background-secondary p-8 rounded-lg shadow-md">
                {/* Nombre de Usuario */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-foreground-secondary">
                        Nombre de Usuario <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Tu nombre de usuario único"
                    />
                </div>

                {/* Nombre Completo */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground-secondary">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Ej: Juan Pérez"
                    />
                </div>

                {/* URL del Avatar */}
                <div>
                    <label htmlFor="avatarUrl" className="block text-sm font-medium text-foreground-secondary">
                        Avatar Image
                    </label>
                    <input
                        type="file"
                        id="avatarUpload"
                        name="avatarUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-foreground-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
                    />
                    {avatarUrl && (
                        <div className="mt-2 w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                            <Image src={avatarUrl} alt="Vista previa del avatar" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                {/* Habilidades */}
                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-foreground-secondary">
                        Habilidades
                    </label>
                    <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Ej: JavaScript, React, Node.js, etc."
                    />
                </div>

                {/* Biografía */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-foreground-secondary">
                        Biografía
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Cuéntanos un poco sobre ti y tu trabajo..."
                    ></textarea>
                </div>

                {error && (
                    <p className="text-sm text-red-600 animate-fade-in">{error}</p>
                )}
                {success && (
                    <p className="text-sm text-green-600 animate-fade-in">{success}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md border border-transparent bg-primary py-2 px-4 text-base font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin mr-2" /> Guardando...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center">
                            <Save size={20} className="mr-2" /> Guardar Cambios
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
}