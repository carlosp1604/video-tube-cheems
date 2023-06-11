import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { container } from '~/awailix.container'
import { Login } from '~/modules/Auth/Application/Login/Login'
import { NextApiRequest, NextApiResponse } from 'next'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize (credentials): Promise<User | null> {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        const loginUseCase = container.resolve<Login>('loginUseCase')

        try {
          const userApplicationDto = await loginUseCase.login({
            email,
            password,
          })

          return {
            id: userApplicationDto.id,
            email: userApplicationDto.email,
            name: userApplicationDto.name,
            image: userApplicationDto.imageUrl,
          }
        } catch (exception: unknown) {
          console.error(exception)

          // TODO: Handle every possible case. At the moment we dont need to handle current cases
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 604800,
  },
  callbacks: {
    async session ({ session, token }) {
      if (session.user) {
        session.user.id = token.userId
      }

      return Promise.resolve(session)
    },
    async jwt ({ token, user }) {
      if (user?.id) {
        token.userId = user.id
      }

      return Promise.resolve(token)
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
}

export default async function auth (request: NextApiRequest, response: NextApiResponse) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')

  return await NextAuth(request, response, authOptions)
}
