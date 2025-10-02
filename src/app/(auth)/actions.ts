'use server'

import { createClient } from '@/lib/supabase/client'
import { headers } from 'next/headers'
import { redirect } from "next/navigation";

export async function signInWithGitHub() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
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

export async function singInWithEmail({ email }: { email: string }) {
    const supabase = createClient()
    const headersList = await headers()
    const referer = headersList.get('referer') || `${process.env.NEXT_PUBLIC_BASE_URL}/login`

    const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
            // In a real app, you might want to customize the email template
            // or use a custom SMTP server for sending emails.
        }
    })

    if (error) {
        console.error('Error during email sign-in:', error.message)
        throw new Error('Failed to send sign-in email')
    }

    // Optionally, you can redirect to a "check your email" page
    redirect(referer)
}

export async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error during sign-out:', error.message)
        throw new Error('Failed to sign out')
    }

    // Redirect to the homepage or login page after sign-out
    redirect('/login')
}

export async function registerWithEmail({ email, password }: { email: string, password: string }) {
    const supabase = createClient()
    const headersList = await headers()
    const referer = headersList.get('referer') || `${process.env.NEXT_PUBLIC_BASE_URL}/login`

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
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