import type { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import { CreateUser } from '~/modules/Auth/Application/CreateUser/CreateUser'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'
import {
  CreateUserApiRequestValidator
} from '~/modules/Auth/Infrastructure/Api/Validators/CreateUserApiRequestValidator'
import { CreateUserApplicationException } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationException'
import {
  CreateUserApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/Api/Translators/CreateUserApplicationRequestTranslator'
import {
  USER_INVALID_EMAIL,
  USER_INVALID_NAME,
  USER_INVALID_PASSWORD,
  USER_INVALID_USERNAME,
  USER_INVALID_VERIFICATION_TOKEN,
  USER_EMAIL_ALREADY_REGISTERED,
  USER_USERNAME_ALREADY_REGISTERED, USER_METHOD, USER_SERVER_ERROR, USER_VALIDATION
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(response)
  }

  const validationExceptions = CreateUserApiRequestValidator.validate(request.body)

  if (validationExceptions) {
    return handleValidation(response, validationExceptions)
  }

  const applicationRequest = CreateUserApplicationRequestTranslator.fromApi(request.body)
  const useCase = container.resolve<CreateUser>('createUserUseCase')

  try {
    await useCase.create(applicationRequest)
  } catch (exception: unknown) {
    if (!(exception instanceof CreateUserApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case CreateUserApplicationException.emailAlreadyRegisteredId:
        return handleConflict(response, exception, USER_EMAIL_ALREADY_REGISTERED)

      case CreateUserApplicationException.usernameAlreadyRegisteredId:
        return handleConflict(response, exception, USER_USERNAME_ALREADY_REGISTERED)

      case CreateUserApplicationException.verificationTokenIsNotValidId:
        return handleUnauthorized(response)

      case CreateUserApplicationException.invalidUsernameId:
        return handleUnprocessableEntity(response, exception, USER_INVALID_USERNAME)

      case CreateUserApplicationException.invalidEmailId:
        return handleUnprocessableEntity(response, exception, USER_INVALID_EMAIL)

      case CreateUserApplicationException.invalidPasswordId:
        return handleUnprocessableEntity(response, exception, USER_INVALID_PASSWORD)

      case CreateUserApplicationException.invalidNameId:
        return handleUnprocessableEntity(response, exception, USER_INVALID_NAME)

      default: {
        console.error(exception)

        return handleInternalError(response)
      }
    }
  }

  return response.status(201).end()
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'POST')
    .status(405)
    .json({
      code: USER_METHOD,
      message: 'HTTP method not allowed',
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
      message: 'Invalid request body',
      errors: validationException.exceptions,
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: USER_SERVER_ERROR,
      message: 'Something went wrong while processing request',
    })
}

function handleConflict (response: NextApiResponse, exception: CreateUserApplicationException, code: string) {
  return response.status(409)
    .json({
      code,
      message: exception.message,
    })
}

function handleUnprocessableEntity (
  response: NextApiResponse,
  exception: CreateUserApplicationException,
  code: string
) {
  return response.status(422)
    .json({
      code,
      message: exception.message,
    })
}

function handleUnauthorized (response: NextApiResponse) {
  return response.status(401)
    .json({
      code: USER_INVALID_VERIFICATION_TOKEN,
      message: 'Token is invalid or expired',
    })
}
