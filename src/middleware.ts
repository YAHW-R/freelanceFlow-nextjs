import { NextResponse, NextRequest } from 'next/server'
import { createClient } from './lib/supabase/server'


const publicPaths = [
    '/login',
    '/register',
    '/',
    '/about',
    '/functions',
    '/prices',
    '/docs',
]


export const middleware = async (request: NextRequest) => {
    const url = request.nextUrl
    const pathname = url.pathname

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser()

    if (!publicPaths.includes(pathname) && !user) {
        const cloneUrl = url.clone()
        cloneUrl.pathname = '/login'
        cloneUrl.searchParams.set('redirectedFrom', pathname)
        return NextResponse.redirect(cloneUrl)
    }

    return NextResponse.next()
}