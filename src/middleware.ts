import { NextResponse, NextRequest } from 'next/server'


const publicPaths = [
    '/login',
    '/register',
    '/home'
]


export const middleware = (request: NextRequest) => {
    const pathname = request.nextUrl.pathname

    const seccion = true

    if (!publicPaths.includes(pathname) && !seccion) {
        return NextResponse.redirect(new URL('/login'))
    }

    return NextResponse.next()
}