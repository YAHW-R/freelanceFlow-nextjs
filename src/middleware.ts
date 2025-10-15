import { NextResponse, NextRequest } from 'next/server'
import { createClient } from './lib/supabase/server'



export const middleware = async (request: NextRequest) => {
    const url = request.nextUrl
    const pathname = url.pathname

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && pathname.startsWith('/dashboard')) {
        const cloneUrl = url.clone()
        cloneUrl.pathname = '/login'
        cloneUrl.searchParams.set('redirectedFrom', pathname)
        return NextResponse.redirect(cloneUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}