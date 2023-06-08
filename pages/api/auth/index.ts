import { container } from '~/awailix.container'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { GetUserById } from '~/modules/Auth/Application/GetUserById'
import { NextApiRequest, NextApiResponse } from 'next'
import { GetUserByIdApplicationException } from '~/modules/Auth/Application/GetUseByIdApplicationException'
import { unstable_getServerSession as UnstableGetServerSession } from 'next-auth/next'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return response
      .setHeader('Allow', 'GET')
      .status(405)
      .json({
        code: 'get-user-by-id-method-not-allowed',
        message: 'HTTP method not allowed',
      })
  }

  const session = await UnstableGetServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthorizationRequired(response)
  }

  const getUser = container.resolve<GetUserById>('getUserById')

  try {
    const user = await getUser.get(session.user.id)

    return response.status(200).json(user)
  } catch (exception: unknown) {
    if (!(exception instanceof GetUserByIdApplicationException)) {
      return handleServerError(response)
    }

    return handleNotFound(response, exception.message)
  }
}

function handleAuthorizationRequired (response: NextApiResponse) {
  response.setHeader('WWW-Authenticate', `Basic realm="${process.env.BASE_URL}"`)

  return response
    .status(401)
    .json({
      code: 'get-user-by-id-authentication-required',
      message: 'User not authenticated',
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'get-user-by-id-server-error',
      message: 'Something went wrong while processing the request',
    })
}

function handleNotFound (response: NextApiResponse, message: string) {
  return response.status(404)
    .json({
      code: 'get-user-by-id-resource-not-found',
      message,
    })
}
