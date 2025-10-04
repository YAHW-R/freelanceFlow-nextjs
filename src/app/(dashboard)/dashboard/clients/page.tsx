// app/(dashboard)/clients/page.tsx

'use client'; // Necesario para useState, filtros interactivos y useRouter

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import Link from 'next/link';
import { Plus, Search, SortAsc, SortDesc } from 'lucide-react'; // Iconos

import { getClients } from '@/app/actions/clientActions';

import type { Client } from '@/lib/types'; // Tipo Client

import ClientCard from '@/app/components/clients/ClientCard';

// Tipos para ordenar
type SortKey = 'name' | 'contactPerson' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    useEffect(() => {
        async function fetchClients() {
            setLoading(true);
            await getClients()
                .then((data) => {
                    setClients(data || []);
                    setError(null);
                })
                .catch((err) => {
                    console.error('Error fetching clients:', err);
                    setError('Error al cargar los clientes. Por favor, inténtalo de nuevo.');
                })
                .finally(() => setLoading(false));
        }

        fetchClients();
    }, []);

    // Clientes filtrados y ordenados (Memoized para optimizar)
    const filteredAndSortedClients = useMemo(() => {
        let currentClients = [...clients];

        // 1. Filtrar por término de búsqueda (nombre, persona de contacto, email, teléfono)
        if (searchTerm.trim()) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentClients = currentClients.filter(
                client =>
                    client.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    client.contact_person?.toLowerCase().includes(lowercasedSearchTerm) ||
                    client.email?.toLowerCase().includes(lowercasedSearchTerm) ||
                    client.phone?.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        // 2. Ordenar
        currentClients.sort((a, b) => {
            let comparison = 0;
            if (sortKey === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortKey === 'contactPerson') {
                // Manejar posibles valores undefined para contactPerson
                const contactA = a.contact_person || '';
                const contactB = b.contact_person || '';
                comparison = contactA.localeCompare(contactB);
            } else if (sortKey === 'created_at') {
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return currentClients;
    }, [clients, searchTerm, sortKey, sortOrder]);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-gray-600">
                <div className="flex items-center space-x-2 text-primary-hover">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-medium">Cargando clientes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-red-600">
                <p className="text-xl font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Encabezado y Botón de Acción */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Mis Clientes</h1>
                <Link
                    href="/dashboard/clients/new"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-fade-in-down"
                >
                    <Plus size={18} className="mr-2" /> Añadir Cliente
                </Link>
            </div>

            {/* Barra de Búsqueda y Ordenación */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0 bg-background-secondary p-4 rounded-lg shadow-sm animate-fade-in-down animation-delay-100">
                {/* Búsqueda */}
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Buscar clientes por nombre, contacto, email o teléfono..."
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary focus:ring-primary text-foreground-primary sm:text-sm"
                    />
                </div>

                {/* Ordenar por */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="sortClients" className="text-sm font-medium text-foreground-secondary">Ordenar por:</label>
                    <select
                        id="sortClients"
                        value={sortKey}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortKey(e.target.value as SortKey)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-foreground-primary bg-background-secondary"
                    >
                        <option value="name">Nombre</option>
                        <option value="contactPerson">Persona de Contacto</option>
                        <option value="created_at">Fecha de Creación</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="rounded-md border border-gray-300 p-2 text-foreground-secondary hover:bg-gray-100 transition-colors duration-200"
                        title={sortOrder === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente'}
                    >
                        {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                    </button>
                </div>
            </div>

            {/* Lista de Clientes (Grid o Tabla) */}
            {filteredAndSortedClients.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedClients.map((client) => (
                        <ClientCard key={client.id} client={client} />
                    ))}
                </div>
            ) : (
                <div className="col-span-full py-10 text-center text-foreground-secondary animate-fade-in">
                    <p className="text-lg">No se encontraron clientes con los filtros actuales.</p>
                    <button onClick={() => { setSearchTerm(''); setSortKey('name'); setSortOrder('asc'); }} className="mt-4 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                        Resetear filtros
                    </button>
                </div>
            )}
        </div>
    );
}