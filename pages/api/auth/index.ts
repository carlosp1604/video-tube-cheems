import { container } from '~/awilix.container'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { GetUserById } from '~/modules/Auth/Application/GetUser/GetUserById'
import { NextApiRequest, NextApiResponse } from 'next'
import { GetUserByIdApplicationException } from '~/modules/Auth/Application/GetUser/GetUserByIdApplicationException'
import { getServerSession } from 'next-auth/next'
import {
  USER_AUTH_REQUIRED,
  USER_METHOD,
  USER_SERVER_ERROR,
  USER_USER_NOT_FOUND
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(response)
  }

  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthorizationRequired(response)
  }

  const getUser = container.resolve<GetUserById>('getUserById')

  try {
    const user = await getUser.get(session.user.id)

    return response.status(200).json(user)
  } catch (exception: unknown) {
    if (!(exception instanceof GetUserByIdApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    return handleNotFound(response, exception.message)
  }
}

function handleAuthorizationRequired (response: NextApiResponse) {
  const baseUrl = container.resolve('baseUrl')

  response.setHeader('WWW-Authenticate', `Basic realm="${baseUrl}"`)

  return response
    .status(401)
    .json({
      code: USER_AUTH_REQUIRED,
      message: 'User not authenticated',
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: USER_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}

function handleNotFound (response: NextApiResponse, message: string) {
  return response.status(404)
    .json({
      code: USER_USER_NOT_FOUND,
      message,
    })
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'GET')
    .status(405)
    .json({
      code: USER_METHOD,
      message: 'HTTP method not allowed',
    })
}
