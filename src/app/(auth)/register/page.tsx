'use client'; // Componente de cliente para manejar estado de formulario

import { useState } from 'react';
import Link from 'next/link';

import { registerWithEmail } from '@/app/actions/authActions';

// Importa tu icono SVG como un componente React
import IconApp from '@/app/components/icons/IconApp.svg';

export default function RegisterPage() {


    // Estado del formulario
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        try {

            if (password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                setIsLoading(false);
                return;
            }

            if (email.trim() === '') {
                setError('El correo electrónico no puede estar vacío.');
                setIsLoading(false);
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Por favor, ingresa un correo electrónico válido.');
                setIsLoading(false);
                return;
            }

            await registerWithEmail({ email, password });

        } catch (err: unknown) {
            const errorMessage =
                typeof err === 'object' && err !== null && 'message' in err && typeof (err as Error).message === 'string'
                    ? (err as Error).message
                    : 'Fallo al registrarse. Inténtalo de nuevo.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-lg bg-background-secondary p-8 shadow-md animate-fade-in-down">
            <div className="mb-6 flex flex-col items-center">
                <IconApp size={48} className="text-primary mb-2" />
                <h2 className="text-3xl font-bold text-foreground">Crear Cuenta</h2>
                <p className="mt-2 text-foreground-secondary">Únete a FreelanceFlow para gestionar tus proyectos</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                        Confirmar Contraseña
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                    />
                </div>

                {error && (
                    <p className="text-sm text-secondary animate-fade-in">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-hover focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-foreground-secondary">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}