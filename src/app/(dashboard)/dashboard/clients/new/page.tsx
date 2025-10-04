// app/(dashboard)/clients/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { Loader2 } from 'lucide-react';


import Link from 'next/link';

import { createClientOfUser } from '@/app/actions/clientActions';


export default function NewClientPage() {
    const router = useRouter();
    const searchParams = useParams();
    const { redirectedFrom } = searchParams; // Captura el parámetro de redirección

    const [name, setName] = useState<string>('');
    const [contactPerson, setContactPerson] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!name.trim()) {
            setError('El nombre del cliente es requerido.');
            setIsLoading(false);
            return;
        }

        try {
            await createClientOfUser({ name: name.trim(), contact_person: contactPerson.trim() || undefined, email: email.trim() || undefined, phone: phone.trim() || undefined, notes: notes.trim() || undefined });
            router.refresh();

            // Redirige de vuelta a la URL especificada o al listado de clientes por defecto
            if (redirectedFrom) {
                const redirectTo =
                    Array.isArray(redirectedFrom) ? redirectedFrom[0] : redirectedFrom;
                router.push(redirectTo);
            } else {
                router.push('/dashboard/clients');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Error al crear cliente:', err);
                setError(err.message);
            } else {
                console.error('Error desconocido al crear cliente:', err);
                setError('Error desconocido al crear el cliente.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="mx-auto max-w-xl space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Crear Nuevo Cliente</h1>
                <Link href="/dashboard/clients" className="text-sm font-medium text-primary hover:underline">
                    Volver a Clientes
                </Link>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-6 bg-background-secondary p-8 rounded-lg shadow-md">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground-secondary">
                        Nombre del Cliente/Empresa <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Ej: Acme Corp."
                    />
                </div>

                <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-foreground-secondary">
                        Persona de Contacto
                    </label>
                    <input
                        type="text"
                        id="contactPerson"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Ej: Jane Doe"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground-secondary">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="cliente@ejemplo.com"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground-secondary">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-foreground-secondary">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Notas internas sobre el cliente..."
                    ></textarea>
                </div>

                {error && <p className="text-sm text-red-600 animate-fade-in">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md border border-transparent bg-primary py-2 px-4 text-base font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin mr-2" /> Creando Cliente...
                        </span>
                    ) : (
                        'Crear Cliente'
                    )}
                </button>
            </form>
        </div>
    );
}