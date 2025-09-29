'use client'; // Componente de cliente para manejar estado de formulario

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Para redirigir
import { Bot } from 'lucide-react'; // Icono del logo

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Aquí simularías una llamada a tu API de autenticación
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password }),
            // });

            // const data = await response.json();

            // if (!response.ok) {
            //   throw new Error(data.message || 'Error de inicio de sesión');
            // }

            // Simulación de éxito
            console.log('Inicio de sesión exitoso:', { email });
            // Guardar token, etc. (usar NextAuth para esto es lo ideal)
            router.push('/dashboard'); // Redirige al dashboard
        } catch (err: unknown) {
            const errorMessage =
                err && typeof err === 'object' && 'message' in err
                    ? (err as { message?: string }).message
                    : 'Fallo al iniciar sesión. Inténtalo de nuevo.';
            setError(errorMessage || 'Fallo al iniciar sesión. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md animate-fade-in-down">
            <div className="mb-6 flex flex-col items-center">
                <Bot size={48} className="text-cyan-600 mb-2" />
                <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
                <p className="mt-2 text-gray-600">Bienvenido de nuevo a FreelanceFlow</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm p-2"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 animate-fade-in">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md border border-transparent bg-cyan-600 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link href="/register" className="font-medium text-cyan-600 hover:text-cyan-500">
                        Regístrate aquí
                    </Link>
                </p>
                <p className="mt-2 text-gray-600">
                    <Link href="/reset-password" className="font-medium text-cyan-600 hover:text-cyan-500">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </p>
            </div>
        </div>
    );
}