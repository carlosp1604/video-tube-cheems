import { DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      name: string
      image: string | null
      email: string
    }
  }

  interface User extends DefaultUser {
    id: string
    username: string
    name: string
    image: string | null
    email: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId: string
    username: string
    email: string
    picture: string | null
  }
}
