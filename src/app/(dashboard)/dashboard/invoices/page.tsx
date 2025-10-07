// app/(dashboard)/billing/page.tsx

'use client'; // Client Component para interactividad y efectos de UI

import { useState, useEffect } from 'react';
import { CreditCard, History, Download, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Datos de ejemplo de transacciones (eventualmente vendrán de Supabase/Stripe)
interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: 'Pagado' | 'Pendiente' | 'Fallido';
    invoiceId?: string;
}

const recentTransactions: Transaction[] = [
    { id: 'trx-001', description: 'Factura ProjectFlow - Octubre', amount: 49.99, date: '2024-10-01', status: 'Pagado', invoiceId: 'INV-2024-10-001' },
    { id: 'trx-002', description: 'Factura ProjectFlow - Septiembre', amount: 49.99, date: '2024-09-01', status: 'Pagado', invoiceId: 'INV-2024-09-001' },
    { id: 'trx-003', description: 'Suscripción Premium anual', amount: 499.00, date: '2024-08-15', status: 'Pagado', invoiceId: 'INV-2024-08-001' },
    { id: 'trx-004', description: 'Factura ProjectFlow - Agosto', amount: 49.99, date: '2024-08-01', status: 'Pagado', invoiceId: 'INV-2024-08-002' },
];

export default function BillingPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPlan, setCurrentPlan] = useState<string>('Premium Anual'); // Placeholder para el plan
    const [nextBillingDate, setNextBillingDate] = useState<string>('15 de Noviembre, 2024'); // Placeholder

    useEffect(() => {
        // Aquí podrías cargar datos de tu API de pagos (ej. Stripe) o de Supabase
        // para obtener el plan del usuario, próxima fecha de cobro y transacciones reales.
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800); // Simula una carga
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-gray-600">
                <div className="flex items-center space-x-2 text-primary-hover">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-medium">Cargando información de facturación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Encabezado */}
            <div className="flex items-center justify-between animate-fade-in-down">
                <h1 className="text-3xl font-bold text-foreground-primary">Facturación</h1>
                <Link
                    href="/dashboard/settings/billing" // Podría ser una página de configuración de suscripción
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <CreditCard size={18} className="mr-2" /> Gestionar Suscripción
                </Link>
            </div>

            {/* Resumen del Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down animation-delay-100">
                <div className="bg-background-secondary rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-foreground-primary flex items-center space-x-2">
                        <DollarSign size={20} className="text-primary" />
                        <span>Tu Plan Actual</span>
                    </h2>
                    <p className="mt-4 text-2xl font-semibold text-foreground-primary">{currentPlan}</p>
                    <p className="mt-2 text-foreground-secondary">
                        Próximo cobro: <span className="font-medium">{nextBillingDate}</span>
                    </p>
                    <Link href="/dashboard/settings/billing" className="mt-4 inline-flex items-center text-primary hover:underline">
                        Cambiar Plan <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>

                {/* Sección de Resumen (podría ser ingresos, gastos, etc. si fuera una herramienta de contabilidad) */}
                <div className="bg-background-secondary rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-foreground-primary flex items-center space-x-2">
                        <History size={20} className="text-primary" />
                        <span>Resumen de Pagos</span>
                    </h2>
                    <p className="mt-4 text-foreground-secondary">
                        Aquí podrías mostrar métricas de facturación, como total gastado este año, o un enlace directo a la configuración de pago.
                    </p>
                    <Link href="/dashboard/settings/payment-methods" className="mt-4 inline-flex items-center text-primary hover:underline">
                        Gestionar Métodos de Pago <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
            </div>


            {/* Historial de Transacciones / Facturas */}
            <div className="bg-background-secondary rounded-lg shadow-md p-8 animate-fade-in-up animation-delay-200">
                <h2 className="text-2xl font-bold text-foreground-primary mb-6 flex items-center space-x-3">
                    <History size={24} className="text-primary" />
                    <span>Historial de Pagos y Facturas</span>
                </h2>

                {recentTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cantidad
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Factura
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-background-secondary divide-y divide-gray-200">
                                {recentTransactions.map((trx) => (
                                    <tr key={trx.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground-primary">
                                            {trx.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">
                                            {trx.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">
                                            {new Date(trx.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${trx.status === 'Pagado' ? 'bg-green-100 text-green-800' :
                                                    trx.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-secondary">
                                            {trx.invoiceId ? (
                                                <a href={`/invoices/${trx.invoiceId}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                                                    <Download size={16} className="mr-1" /> {trx.invoiceId}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-foreground-secondary">No hay transacciones recientes para mostrar.</p>
                )}
            </div>
        </div>
    );
}