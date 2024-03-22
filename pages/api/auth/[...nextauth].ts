import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { container } from '~/awilix.container'
import { NextApiRequest, NextApiResponse } from 'next'
import { OauthLoginSignUp } from '~/modules/Auth/Application/OauthLoginSignUp/OauthLoginSignUp'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
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
        session.user.username = token.username
        session.user.email = token.email
        session.user.image = token.picture
      }

      return Promise.resolve(session)
    },
    async jwt ({ token, account, profile }) {
      if (
        !token.userId &&
        account &&
        profile &&
        account.providerAccountId &&
        account.provider &&
        account.type &&
        profile.name &&
        profile.email
      ) {
        const oauthLoginSignUp: OauthLoginSignUp = container.resolve('oauthLoginSignUpUseCase')

        try {
          const user = await oauthLoginSignUp.loginOrSignup({
            provider: account.provider,
            type: account.type,
            providerAccountId: account.providerAccountId,
            refreshToken: account?.refresh_token ?? null,
            accessToken: account?.access_token ?? null,
            expiresAt: account?.expires_at ?? null,
            tokenType: account?.token_type ?? null,
            scope: account?.scope ?? null,
            idToken: account?.id_token ?? null,
            sessionState: account?.session_state ?? null,
            profile: {
              name: (profile as any).given_name ?? profile.name,
              pictureUrl: null,
              email: profile.email,
              language: 'en', // FIXME: This field is not being used for the moment
              emailVerified: (profile as any).email_verified,
            },
          })

          token.userId = user.id
          token.username = user.username
          token.picture = user.imageUrl
          token.email = user.email
          token.name = user.name
        } catch (exception: unknown) {
          console.error(exception)
        }
      }

      return Promise.resolve(token)
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
}

export default async function auth (request: NextApiRequest, response: NextApiResponse) {
  return await NextAuth(request, response, authOptions)
}
