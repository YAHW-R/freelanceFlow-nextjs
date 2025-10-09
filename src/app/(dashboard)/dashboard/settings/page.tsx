// app/(dashboard)/settings/page.tsx

'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

import {
    UserCog, Bell, Paintbrush,
    Key, Trash2, LogOut, CheckCircle, XCircle, Loader2, Info, Save
} from 'lucide-react';

import { changePassword, deleteAccount, signOutAllDevices } from '@/app/actions/profileActions'; // Asumiendo que están en profileActions

// Tipos de las preferencias de usuario (pueden venir de Supabase o localStorage)
interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: 'es' | 'en';
    timezone: string;
    defaultCurrency: 'EUR' | 'USD' | 'GBP';
    defaultHourlyRate: number;
    emailNotifications: {
        taskDue: boolean;
        projectUpdates: boolean;
        invoices: boolean;
    };
    pushNotifications: {
        taskDue: boolean;
        projectUpdates: boolean;
    };
}

const defaultPreferences: UserPreferences = {
    theme: 'system',
    language: 'es',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Zona horaria del navegador por defecto
    defaultCurrency: 'EUR',
    defaultHourlyRate: 50,
    emailNotifications: { taskDue: true, projectUpdates: true, invoices: true },
    pushNotifications: { taskDue: true, projectUpdates: false },
};


export default function SettingsPage() {

    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Estados para las preferencias (simuladas, deberían cargarse de Supabase)
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

    // Estados para formularios específicos
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [deleteConfirmation, setDeleteConfirmation] = useState<string>(''); // Para confirmar eliminación


    // ===============================================
    // Carga de Preferencias (Simulado)
    // ===============================================
    useEffect(() => {
        // Aquí, en una aplicación real, cargarías las preferencias del usuario de Supabase
        // Por ahora, simulamos una carga
        const timer = setTimeout(() => {
            // Intenta cargar de localStorage si existe
            const storedPrefs = localStorage.getItem('user_app_preferences');
            if (storedPrefs) {
                setPreferences(JSON.parse(storedPrefs));
            }
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Guarda preferencias al cambiar (simulado en localStorage)
    useEffect(() => {
        if (!loading) { // Solo guardar después de la carga inicial
            localStorage.setItem('user_app_preferences', JSON.stringify(preferences));
        }
    }, [preferences, loading]);

    // ===============================================
    // Handlers de Formulario
    // ===============================================

    const handlePreferenceChange = (section: keyof UserPreferences, key: string, value: unknown) => {
        setPreferences(prev => {
            if (typeof prev[section] === 'object' && prev[section] !== null) {
                return {
                    ...prev,
                    [section]: {
                        ...(prev[section] as object),
                        [key]: value
                    }
                };
            }
            return { ...prev, [section]: value };
        });
        setSuccess(null); // Limpiar mensajes de éxito al cambiar algo
    };

    const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsSubmitting(false);
            return;
        }
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            setIsSubmitting(false);
            return;
        }

        try {
            await changePassword(newPassword);
            setSuccess('¡Contraseña actualizada con éxito!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Error al cambiar la contraseña.');
            }
            else {
                setError('Error desconocido al cambiar la contraseña.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'eliminar mi cuenta') {
            setError('Por favor, escribe exactamente "eliminar mi cuenta" para confirmar.');
            return;
        }

        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            await deleteAccount();
            // Redirección manejada en la Server Action
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Error al eliminar la cuenta.');
            } else {
                setError('Error desconocido al eliminar la cuenta.');
            }
            setIsSubmitting(false);
        }
    };

    const handleSignOutAllDevices = async () => {
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            await signOutAllDevices();
            // Redirección manejada en la Server Action
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Error al cerrar sesiones.');
            } else {
                setError('Error desconocido al cerrar sesiones.');
            }
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-foreground-secondary">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="mt-4 text-lg">Cargando configuración...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 animate-fade-in-up">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground-primary">Configuración</h1>
                <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
                    Volver al Dashboard
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between animate-fade-in" role="alert">
                    <span className="block sm:inline">{error}</span>
                    <XCircle size={20} className="cursor-pointer" onClick={() => setError(null)} />
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center justify-between animate-fade-in" role="alert">
                    <span className="block sm:inline">{success}</span>
                    <CheckCircle size={20} className="cursor-pointer" onClick={() => setSuccess(null)} />
                </div>
            )}

            {/* Sección: Cuenta (Cambio de Contraseña, Gestión de Sesiones, Eliminar) */}
            <div className="bg-background-secondary rounded-lg shadow-md p-8 space-y-6">
                <h2 className="text-2xl font-bold text-foreground-primary flex items-center space-x-3">
                    <UserCog size={24} className="text-primary" />
                    <span>Cuenta</span>
                </h2>

                {/* Cambiar Contraseña */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-foreground-primary flex items-center space-x-2">
                        <Key size={20} className="text-secondary" />
                        <span>Cambiar Contraseña</span>
                    </h3>
                    <form onSubmit={handleChangePassword} className="mt-4 space-y-4 max-w-md">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-foreground-secondary">Nueva Contraseña</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground-secondary">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 size={16} className="animate-spin mr-2" />
                            ) : (
                                <Save size={16} className="mr-2" />
                            )}
                            Actualizar Contraseña
                        </button>
                    </form>
                </div>

                {/* Gestión de Sesiones */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-xl font-semibold text-foreground-primary flex items-center space-x-2">
                        <LogOut size={20} className="text-secondary" />
                        <span>Gestión de Sesiones</span>
                    </h3>
                    <p className="mt-2 text-foreground-secondary text-sm">
                        Cerrar sesión en todos los dispositivos activos. Deberás volver a iniciar sesión.
                    </p>
                    <button
                        onClick={handleSignOutAllDevices}
                        disabled={isSubmitting}
                        className="mt-4 inline-flex items-center rounded-md border border-red-300 bg-transparent px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors duration-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin mr-2" />
                        ) : (
                            <LogOut size={16} className="mr-2" />
                        )}
                        Cerrar Sesión en Todos los Dispositivos
                    </button>
                </div>

                {/* Eliminar Cuenta */}
                <div className="border-t border-red-200 pt-6 mt-6">
                    <h3 className="text-xl font-semibold text-red-600 flex items-center space-x-2">
                        <Trash2 size={20} />
                        <span>Eliminar Cuenta</span>
                    </h3>
                    <p className="mt-2 text-foreground-secondary text-sm">
                        Esta acción es irreversible. Todos tus datos asociados se eliminarán permanentemente.
                    </p>
                    <div className="mt-4">
                        <label htmlFor="deleteConfirmation" className="block text-sm font-medium text-red-600">
                            {`Escribe "eliminar mi cuenta" para confirmar:`}
                        </label>
                        <input
                            type="text"
                            id="deleteConfirmation"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2"
                            placeholder="eliminar mi cuenta"
                        />
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isSubmitting || deleteConfirmation !== 'eliminar mi cuenta'}
                            className="mt-4 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 size={16} className="animate-spin mr-2" />
                            ) : (
                                <Trash2 size={16} className="mr-2" />
                            )}
                            Eliminar Permanentemente mi Cuenta
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección: Preferencias de la Aplicación */}
            <div className="bg-background-secondary rounded-lg shadow-md p-8 space-y-6">
                <h2 className="text-2xl font-bold text-foreground-primary flex items-center space-x-3">
                    <Paintbrush size={24} className="text-primary" />
                    <span>Preferencias de la Aplicación</span>
                </h2>

                {/* Tema */}
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-foreground-secondary">Tema</label>
                    <select
                        id="theme"
                        value={preferences.theme}
                        onChange={(e) => handlePreferenceChange('theme', '', e.target.value as 'light' | 'dark' | 'system')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                    >
                        <option value="system">Seguir el sistema</option>
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                    </select>
                </div>

                {/* Idioma */}
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-foreground-secondary">Idioma</label>
                    <select
                        id="language"
                        value={preferences.language}
                        onChange={(e) => handlePreferenceChange('language', '', e.target.value as 'es' | 'en')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                    >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                    </select>
                </div>

                {/* Zona Horaria */}
                <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-foreground-secondary">Zona Horaria</label>
                    <select
                        id="timezone"
                        value={preferences.timezone}
                        onChange={(e) => handlePreferenceChange('timezone', '', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                    >
                        {/* Lista de zonas horarias, simplificada para el ejemplo */}
                        {Intl.supportedValuesOf('timeZone').map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                </div>

                {/* Moneda y Tasa Horaria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="defaultCurrency" className="block text-sm font-medium text-foreground-secondary">Moneda Predeterminada</label>
                        <select
                            id="defaultCurrency"
                            value={preferences.defaultCurrency}
                            onChange={(e) => handlePreferenceChange('defaultCurrency', '', e.target.value as 'EUR' | 'USD' | 'GBP')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-background-secondary text-foreground-primary"
                        >
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">Dólar Americano ($)</option>
                            <option value="GBP">Libra Esterlina (£)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="defaultHourlyRate" className="block text-sm font-medium text-foreground-secondary">Tarifa Horaria Predeterminada</label>
                        <input
                            type="number"
                            id="defaultHourlyRate"
                            value={preferences.defaultHourlyRate}
                            onChange={(e) => handlePreferenceChange('defaultHourlyRate', '', parseFloat(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            {/* Sección: Notificaciones */}
            <div className="bg-background-secondary rounded-lg shadow-md p-8 space-y-6">
                <h2 className="text-2xl font-bold text-foreground-primary flex items-center space-x-3">
                    <Bell size={24} className="text-primary" />
                    <span>Notificaciones</span>
                </h2>

                <div className="space-y-4">
                    {/* Email Notifications */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground-primary">Notificaciones por Email</h3>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                                <input
                                    id="emailTaskDue"
                                    type="checkbox"
                                    checked={preferences.emailNotifications.taskDue}
                                    onChange={(e) => handlePreferenceChange('emailNotifications', 'taskDue', e.target.checked)}
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="emailTaskDue" className="ml-3 block text-sm font-medium text-foreground-secondary">
                                    Tareas próximas a vencer
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="emailProjectUpdates"
                                    type="checkbox"
                                    checked={preferences.emailNotifications.projectUpdates}
                                    onChange={(e) => handlePreferenceChange('emailNotifications', 'projectUpdates', e.target.checked)}
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="emailProjectUpdates" className="ml-3 block text-sm font-medium text-foreground-secondary">
                                    Actualizaciones de proyectos
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="emailInvoices"
                                    type="checkbox"
                                    checked={preferences.emailNotifications.invoices}
                                    onChange={(e) => handlePreferenceChange('emailNotifications', 'invoices', e.target.checked)}
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="emailInvoices" className="ml-3 block text-sm font-medium text-foreground-secondary">
                                    Nuevas facturas y pagos
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-semibold text-foreground-primary">Notificaciones Push (del navegador)</h3>
                        <p className="text-sm text-foreground-secondary mt-1">
                            (Asegúrate de haber permitido las notificaciones en la configuración de tu navegador).
                        </p>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                                <input
                                    id="pushTaskDue"
                                    type="checkbox"
                                    checked={preferences.pushNotifications.taskDue}
                                    onChange={(e) => handlePreferenceChange('pushNotifications', 'taskDue', e.target.checked)}
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="pushTaskDue" className="ml-3 block text-sm font-medium text-foreground-secondary">
                                    Tareas próximas a vencer
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="pushProjectUpdates"
                                    type="checkbox"
                                    checked={preferences.pushNotifications.projectUpdates}
                                    onChange={(e) => handlePreferenceChange('pushNotifications', 'projectUpdates', e.target.checked)}
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="pushProjectUpdates" className="ml-3 block text-sm font-medium text-foreground-secondary">
                                    Actualizaciones de proyectos
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección: Información Legal y Soporte */}
            <div className="bg-background-secondary rounded-lg shadow-md p-8 space-y-6 text-foreground-secondary">
                <h2 className="text-2xl font-bold text-foreground-primary flex items-center space-x-3">
                    <Info size={24} className="text-primary" />
                    <span>Información y Soporte</span>
                </h2>
                <div className="space-y-2 text-sm">
                    <Link href="/terms" className="block text-primary hover:underline">Términos de Servicio</Link>
                    <Link href="/privacy" className="block text-primary hover:underline">Política de Privacidad</Link>
                    <Link href="/contact" className="block text-primary hover:underline">Contactar Soporte</Link>
                    <p className="mt-4 text-xs text-gray-500">Versión de la Aplicación: 1.0.0</p>
                    <p className="text-xs text-gray-500">© 2024 ProjectFlow. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
}