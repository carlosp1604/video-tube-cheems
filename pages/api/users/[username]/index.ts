import { container } from '~/awilix.container'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  GetUserByUsernameApiRequestValidator
} from '~/modules/Auth/Infrastructure/Api/Validators/GetUserByUsernameApiRequestValidator'
import {
  GetUserByUsernameApplicationException
} from '~/modules/Auth/Application/GetUser/GetUserByUsernameApplicationException'
import {
  USER_BAD_REQUEST,
  USER_METHOD,
  USER_SERVER_ERROR,
  USER_USER_NOT_FOUND, USER_VALIDATION
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(response)
  }

  const username = request.query.username

  if (!username) {
    return handleBadRequest(response)
  }

  const validationException =
    GetUserByUsernameApiRequestValidator.validate(String(username))

  if (validationException) {
    return handleValidation(response, validationException)
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

function handleBadRequest (
  response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: USER_BAD_REQUEST,
      message: 'username parameter is required',
    })
}

function handleValidation (
  response: NextApiResponse,
  validationException: UserApiValidationException
) {
  return response
    .status(400)
    .json({
      code: USER_VALIDATION,
      message: 'Invalid request',
      errors: validationException.exceptions,
    })
}
