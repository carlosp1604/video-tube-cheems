import NextAuth, { NextAuthOptions, RequestInternal, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import MysqlNextAuthAdapter from '../../../modules/Auth/Infrastructure/MysqlNextAuthAdapter'
import { bindings } from '../../../modules/Auth/Infrastructure/Bindings'
import { UserRepositoryInterface } from '../../../modules/Auth/Domain/UserRepositoryInterface'
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

        // TODO: Find a way to handle this correctly using the adapter
        const userRepository = bindings.get<UserRepositoryInterface>('UserRepositoryInterface')

        const domainUser = await (
          userRepository.findByEmail(email)
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
  },
  session: {
    strategy: 'jwt'
  }
}

export default NextAuth(authOptions)