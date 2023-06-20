import { container } from '~/awilix.container'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  GetUserByUsernameApiRequestValidator
} from '~/modules/Auth/Infrastructure/Validators/GetUserByUsernameApiRequestValidator'
import {
  GetUserByUsernameApplicationException
} from '~/modules/Auth/Application/GetUser/GetUserByUsernameApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(response)
  }

  const username = request.query.username

  const validationException =
    GetUserByUsernameApiRequestValidator.validate(username ? username.toString() : '')

  if (validationException) {
    return handleBadRequest(response, validationException)
  }

  const getUser = container.resolve<GetUserByUsername>('getUserByUsername')

  try {
    const user = await getUser.get(username as string)

    return response.status(200).json(user)
  } catch (exception: unknown) {
    if (!(exception instanceof GetUserByUsernameApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    return handleNotFound(response, exception.message)
  }
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'get-user-server-error',
      message: 'Something went wrong while processing the request',
    })
}

function handleNotFound (response: NextApiResponse, message: string) {
  return response.status(404)
    .json({
      code: 'get-user-resource-not-found',
      message,
    })
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'PATCH')
    .status(405)
    .json({
      code: 'get-user-method-not-allowed',
      message: 'HTTP method not allowed',
    })
}

function handleBadRequest (
  response: NextApiResponse,
  validationException: UserApiValidationException
) {
  return response
    .status(400)
    .json({
      code: 'get-user-bad-request',
      message: 'Invalid request',
      errors: validationException.exceptions,
    })
}
