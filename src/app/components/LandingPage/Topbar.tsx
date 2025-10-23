'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import IconApp from "@/app/components/icons/IconApp.svg";


export default function TopBar() {

    const pathname = usePathname();
    const paths = ['/', '/functions', '/prices']
    const pathsPage = { '/': "Inicio", '/functions': "Funciones", '/prices': "Precios" }


    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Crear el cliente de Supabase
        const supabase = createClient();

        // Funcion para determinar si el usuario está autenticado
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Si el usuario está autenticado, redirigir a /dashboard
                setIsAuthenticated(true);

            }
        };

        checkAuth();
    }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

    return (
        <nav className="bg-background-secondary shadow-sm sticy top-0 z-50 animate-fade-in-down animate-delay-100">
            < div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
                <div className="flex justify-between h-16">
                    <Link href="/" className="flex items-center">
                        <IconApp className="h-8 w-8 text-primary" />
                        <span className="ml-2 text-xl font-bold text-foreground hover:text-primary transition` select-none">
                            FreelanceFlow
                        </span>
                    </Link>
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {paths.map((path) => (
                            <Link
                                key={path}
                                href={path}
                                className={`text-foreground-secondary hover:text-foreground text-sm font-medium ${pathname === path ? "border-b-2 border-primary-active" : ""}`}
                            >
                                {pathsPage[path as keyof typeof pathsPage]}
                            </Link>
                        ))}
                    </div>

                    {isAuthenticated ? (
                        <Link href="/dashboard" className="h-fit my-auto px-4 py-2 rounded-md shadow-sm text-fore` bg-primary hover:bg-primary-hover transition">
                            Dashboard
                        </Link>
                    ) : (
                        <Link href="/login" className="h-fit my-auto px-4 py-2 rounded-md shadow-sm text-foreground bg-background hover:bg-background-secondary transition">
                            Iniciar sesión
                        </Link>
                    )}
                </div>
            </div >
        </nav >
    )
}