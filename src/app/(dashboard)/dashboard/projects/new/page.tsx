// app/(dashboard)/projects/new/page.tsx

'use client'; // Es un Client Component debido al formulario interactivo y uso de `useState`

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, PlusCircle } from 'lucide-react'; // Iconos
import { createProject } from '@/app/actions/projectsActions';
import { getClients } from '@/app/actions/clientActions';
import { ProjectStatus, ClientOptions, Project } from '@/lib/types';


import Link from 'next/link';

export default function NewProjectPage() {
    const router = useRouter();

    // Para manejar redirecciones si no hay clientes
    const searchParams = useParams();
    const { redirectedFrom } = searchParams; // Captura el parámetro de redirección

    // Estados para manejar la carga de clientes y el formulario
    const [clients, setClients] = useState<ClientOptions[]>([]);
    const [formLoading, setFormLoading] = useState<boolean>(true); // Para cargar clientes
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Para el envío del formulario
    const [error, setError] = useState<string | null>(null);

    // Estados del formulario
    const [name, setName] = useState<string>('');
    const [clientId, setClientId] = useState<string>('');
    const [description, setDescription] = useState<string>('');


    const [status, setStatus] = useState<ProjectStatus>('pending'); // Estado inicial por defecto
    const [billingType, setBillingType] = useState<'hourly' | 'fixed_price'>('fixed_price');
    const [dueDate, setDueDate] = useState<string>(''); // Formato 'YYYY-MM-DD'
    const [budget, setBudget] = useState<number | ''>(''); // Presupuesto opcional

    useEffect(() => {
        async function fetchClients() {
            setFormLoading(true);
            try {
                const fetchedClients = await getClients();
                setClients(fetchedClients);
                if (fetchedClients.length > 0) {
                    setClientId(fetchedClients[0].id); // Selecciona el primer cliente por defecto
                } else {
                    // Si no hay clientes, redirigir
                    router.push('/dashboard/clients/new?redirectedFrom=/dashboard/projects/new');
                }
            } catch (err: unknown) {
                console.error('Error al cargar clientes:', err);
                setError('No se pudieron cargar los clientes. Inténtalo de nuevo.');
                // Si hay un error al cargar, pero la redirección no se ha activado,
                // podríamos dar una opción para ir a crear cliente.
            } finally {
                setFormLoading(false);
            }
        }
        fetchClients();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!clientId) {
            setError('Por favor, selecciona un cliente.');
            setIsSubmitting(false);
            return;
        }

        try {
            // TODO: Reemplaza 'userId' con el valor real del usuario autenticado
            const formData = {
                name,
                client_id: clientId,
                description: description || undefined, // undefined para que Supabase use null si no hay descripción
                status,
                billing_type: billingType,
                due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
                budget: budget === '' ? undefined : budget,
                created_at: new Date().toISOString() // Set current timestamp
            };

            await createProject(formData);
            if (redirectedFrom) {
                const redirectUrl = Array.isArray(redirectedFrom) ? redirectedFrom[0] : redirectedFrom;
                router.push(redirectUrl);
            } else {
                router.push('/dashboard/projects');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Error desconocido al crear el proyecto.');
            } else {
                setError('Error desconocido al crear el proyecto.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (formLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="mt-4 text-lg">Cargando clientes...</p>
            </div>
        );
    }

    if (clients.length === 0 && !formLoading) {
        // Si llegamos aquí y no hay clientes después de cargar, significa que la redirección falló
        // o el usuario navegó de vuelta. Ofrecemos la opción explícita.
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary p-4">
                <p className="text-xl font-medium text-center">
                    Parece que aún no tienes ningún cliente registrado.
                </p>
                <p className="mt-2 text-md text-center">
                    Necesitas un cliente para crear un proyecto.
                </p>
                <Link
                    href="/dashboard/clients/new?redirectedFrom=/dashboard/projects/new"
                    className="mt-6 inline-flex items-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <PlusCircle size={20} className="mr-2" /> Crear Nuevo Cliente
                </Link>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-primary hover:text-primary-hover transition-colors duration-200"
                >
                    Volver a Proyectos
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Crear Nuevo Proyecto</h1>
                <Link href="/dashboard/projects" className="text-sm font-medium text-primary hover:underline">
                    Volver a Proyectos
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-background-secondary p-8 rounded-lg shadow-md">
                {/* Nombre del Proyecto */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground-secondary">
                        Nombre del Proyecto <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Ej: Rediseño de sitio web para Acme Corp."
                    />
                </div>

                {/* Selección de Cliente */}
                <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-foreground-secondary">
                        Cliente <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="clientId"
                        name="clientId"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                    >
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                    {clients.length === 0 && (
                        <p className="mt-2 text-sm text-red-600">
                            No tienes clientes registrados. Por favor,{' '}
                            <Link href="/dashboard/clients/new?redirectBack=/dashboard/projects/new" className="font-medium underline hover:text-red-700">
                                crea uno primero
                            </Link>
                            .
                        </p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground-secondary">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Describe brevemente los objetivos y el alcance del proyecto."
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Estado del Proyecto */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-foreground-secondary">
                            Estado
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                        >
                            <option value="pending">Pendiente</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="in_pause">En Pausa</option>
                        </select>
                    </div>

                    {/* Tipo de Facturación */}
                    <div>
                        <label htmlFor="billingType" className="block text-sm font-medium text-foreground-secondary">
                            Tipo de Facturación
                        </label>
                        <select
                            id="billingType"
                            name="billingType"
                            value={billingType}
                            onChange={(e) => setBillingType(e.target.value as 'hourly' | 'fixed_price')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                        >
                            <option value="fixed_price">Precio Fijo</option>
                            <option value="hourly">Por Hora</option>
                        </select>
                    </div>
                </div>

                {/* Fecha de Entrega */}
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-foreground-secondary">
                        Fecha de Entrega <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                    />
                </div>

                {/* Presupuesto (Opcional) */}
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-foreground-secondary">
                        Presupuesto (€)
                    </label>
                    <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        placeholder="Ej: 5000"
                        min="0"
                        step="0.01"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 animate-fade-in">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md border border-transparent bg-primary py-2 px-4 text-base font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin mr-2" /> Creando Proyecto...
                        </span>
                    ) : (
                        'Crear Proyecto'
                    )}
                </button>
            </form>
        </div>
    );
}