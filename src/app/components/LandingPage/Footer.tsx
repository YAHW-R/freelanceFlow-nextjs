// app/components/layout/Footer.tsx

import Link from 'next/link';
import {
    FaInstagram,    // Instagram
    FaFacebookF,    // Facebook
    FaTwitter,      // Twitter
    FaLinkedinIn,   // LinkedIn
    FaGithub,       // GitHub (opcional, si es relevante para freelancers/devs)
} from 'react-icons/fa'; // Importa los iconos que necesites

export default function Footer() {
    // Define tus enlaces a redes sociales. Por ahora son placeholders.
    const socialLinks = [
        { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/yourprofile' },
        { name: 'Facebook', icon: FaFacebookF, href: 'https://facebook.com/yourprofile' },
        { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/yourprofile' },
        { name: 'LinkedIn', icon: FaLinkedinIn, href: 'https://linkedin.com/in/yourprofile' },
        { name: 'GitHub', icon: FaGithub, href: 'https://github.com/yourprofile' }, // Opcional
    ];

    return (
        <footer className="bg-background-secondary border-t border-background-secondary">
            <div className="mx-auto max-w-7xl px-4 py-8 md:py-12"> {/* Ajusté un poco el padding vertical */}
                <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
                    {/* Copyright Info */}
                    <p className="text-base text-foreground-secondary text-center md:text-left">
                        &copy; {new Date().getFullYear()} ProjectFlow. Todos los derechos reservados.
                    </p>

                    {/* Social Media Links */}
                    <div className="flex space-x-6">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                target="_blank" // Abrir en una nueva pestaña
                                rel="noopener noreferrer" // Seguridad recomendada para target="_blank"
                                className="text-foreground-secondary hover:text-primary-hover transition-colors duration-200"
                                aria-label={`Visita nuestro perfil en ${social.name}`}
                            >
                                <social.icon size={24} /> {/* Renderiza el icono con un tamaño */}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}