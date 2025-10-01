// app/components/layout/AuthTopbar.tsx

import Link from 'next/link';
import IconApp from '@/app/components/icons/IconApp.svg';

interface AuthTopbarProps {
    // Puedes añadir props si necesitas pasar información dinámica,
    // como un texto personalizado o un botón específico
    showLoginButton?: boolean;
    showRegisterButton?: boolean;
}

export default function AuthTopbar({ showLoginButton = false, showRegisterButton = false }: AuthTopbarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-background-secondary px-6 shadow-sm animate-fade-in-down">
            {/* Sección del Logo */}
            <Link href="/" className="flex items-center space-x-2 text-foreground-primary hover:text-primary-hover transition-colors duration-200">
                <IconApp size={32} className="text-primary" />
                <span className="text-xl font-bold">FreelanceFlow</span>
            </Link>

            {/* Sección de Botones de Navegación (opcional) */}
            <nav className="flex items-center space-x-4">
                {showLoginButton && (
                    <Link
                        href="/login"
                        className="rounded-md px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-primary-hover transition-colors duration-200"
                    >
                        Iniciar Sesión
                    </Link>
                )}
                {showRegisterButton && (
                    <Link
                        href="/register"
                        className="rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Regístrate
                    </Link>
                )}
            </nav>
        </header>
    );
}