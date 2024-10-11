import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from './lib/session';

const protectedRoutes = ['/chat', '/profile'];
const publicRoutes = ['/login', '/signup', '/oauth/callback/github', '/start/home','/start/prices', '/start/about-us' ];

export default async function middleware(req) {
    const path = req.nextUrl.pathname;

    console.log("IN MIDDLEWARE")
    // Verificar si la ruta es protegida o pública
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // Obtener el valor de la cookie 'session'
    const cookie = cookies().get('session');

    console.log("The coockies ", !cookie)
    // Si no hay cookie de sesión, y es una ruta protegida, redirigir al login
    if (!cookie && isProtectedRoute) {
        console.log("Session is not here")
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (cookie) {
        const session = await decrypt(cookie.value);

        
        console.log("Session is here ", session)
        if ((!session?.accessToken || !session?.token || !session.lastRefresh) && isProtectedRoute) {
            console.log("Bad session")
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }

        // Si el usuario ya está autenticado y está en una ruta pública, redirigir al dashboard
        if (isPublicRoute && session?.accessToken) {
            console.log("Vete al chat so memo")
            return NextResponse.redirect(new URL('/chat', req.nextUrl));
        }
    }
    console.log("nos vamos next ")
    // Si pasa todas las verificaciones, continuar con la petición
    return NextResponse.next();
}

// Configuración para excluir ciertas rutas del middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
