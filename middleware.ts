import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware (request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acceso directo a recursos estáticos (imágenes, CSS, etc.)
  const isStaticFile = pathname.match(/\.(.*)$/)
  const isGoodbyePage = pathname === '/goodbye.html'

  if (isStaticFile || isGoodbyePage) {
    return NextResponse.next()
  }

  // Redirigir todas las demás rutas a goodbye.html
  return NextResponse.redirect(new URL('/goodbye.html', request.url))
}

export const config = {
  matcher: '/:path*', // aplica a todas las rutas
}
