import NextAuth, { NextAuthOptions, RequestInternal, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import MysqlNextAuthAdapter from '../../../modules/Auth/Infrastructure/MysqlNextAuthAdapter'
import { MysqlUserRepository } from '../../../modules/Auth/Infrastructure/MysqlUserRepository'
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text', placeholder: 'name@example.com' },
        password: { label: 'Password', type: 'password ' }
      },

      async authorize(
        credentials: Record<'email' | 'password', string> | undefined,
        req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>
      ): Promise<User | null> {
        const email = credentials?.email as string
        const password = credentials?.password as string

        // TODO: Find a way to handle this correctly
        const domainUser = await (
          new MysqlUserRepository().findByEmail(email)
        )

        if (
          domainUser === null ||
          ! (await domainUser.matchPassword(password))
        ) {
          return null
        }

        return {
          id: domainUser.id,
          email: domainUser.email,
          name: domainUser.name,
          image: domainUser.imageUrl,
        }
      }
    })
  ],
  adapter: MysqlNextAuthAdapter(),
  pages: {
    signIn: '/auth/signin'
  }
}

export default NextAuth(authOptions)