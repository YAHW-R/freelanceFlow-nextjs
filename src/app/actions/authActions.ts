'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from "next/navigation";


// Función para manejar el inicio de sesión con GitHub
export async function signInWithGitHub() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        }
    })

    if (error) {
        console.error('Error during GitHub sign-in:', error.message)
        throw new Error('Failed to initiate GitHub sign-in')
    }

    if (data.url) {
        // Redirect the user to the GitHub OAuth URL
        redirect(data.url)
    } else {
        throw new Error('No URL returned for GitHub sign-in')
    }
}

// Función para manejar el inicio de sesión con Google
export async function signInWithGoogle() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        }
    })

    if (error) {
        console.error('Error during Google sign-in:', error.message)
        throw new Error('Failed to initiate Google sign-in')
    }

    if (data.url) {
        // Redirect the user to the Google OAuth URL
        redirect(data.url)
    } else {
        throw new Error('No URL returned for Google sign-in')
    }
}

// Función para manejar el inicio de sesión con enlace de correo electrónico
export async function singInWithEmailLink({ email }: { email: string }) {
    const supabase = await createClient()
    const headersList = await headers()
    const referer = headersList.get('referer') || `${process.env.NEXT_PUBLIC_BASE_URL}/login`

    const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        }
    })

    if (error) {
        console.error('Error during email sign-in:', error.message)
        throw new Error('Failed to send sign-in email')
    }

    // Optionally, you can redirect to a "check your email" page
    redirect(referer)
}


// Función para manejar el inicio de sesión con correo electrónico y contraseña
export async function signInWithEmail({ email, password, redirectPage }: { email: string, password: string, redirectPage?: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Error during email sign-in:', error.message)
        throw new Error('Failed to sign in with email and password')
    }

    if (data.user) {
        // Redirect to the dashboard or another protected page after successful sign-in
        if (redirectPage) redirect(redirectPage)
        else redirect('/dashboard')
    } else {
        throw new Error('No user data returned after sign-in')
    }
}

// Función para manejar el cierre de sesión
export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error during sign-out:', error.message)
        throw new Error('Failed to sign out')
    }

    // Redirect to the homepage or login page after sign-out
    redirect('/login')
}

// Función para manejar el registro con correo electrónico y contraseña
export async function registerWithEmail({ email, password }: { email: string, password: string }) {
    const supabase = await createClient()
    const headersList = await headers()
    const referer = headersList.get('referer') || `${process.env.NEXT_PUBLIC_APP_URL}/register/check-email`

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            // In a real app, you might want to customize the email template
            // or use a custom SMTP server for sending emails.
        }
    })

    if (error) {
        console.error('Error during email registration:', error.message)
        throw new Error('Failed to send registration email')
    }

    // Optionally, you can redirect to a "check your email" page
    redirect(referer)
}