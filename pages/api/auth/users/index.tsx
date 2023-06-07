import type { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awailix.container'
import { CreateUser } from '~/modules/Auth/Application/CreateUser/CreateUser'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import { CreateUserApiRequestValidator } from '~/modules/Auth/Infrastructure/Validators/CreateUserApiRequestValidator'
import { CreateUserApplicationException } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationException'
import {
  CreateUserApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/Translators/CreateUserApplicationRequestTranslator'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(response)
  }

  const validationExceptions = CreateUserApiRequestValidator.validate(request.body)

  if (validationExceptions) {
    return handleBadRequest(response, validationExceptions)
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
      case CreateUserApplicationException.usernameAlreadyRegisteredId:
        return handleConflict(response, exception)
      case CreateUserApplicationException.verificationTokenIsNotValidId:
        return handleUnauthorized(response)
      case CreateUserApplicationException.invalidUsernameId:
      case CreateUserApplicationException.invalidEmailId:
      case CreateUserApplicationException.invalidPasswordId:
      case CreateUserApplicationException.invalidNameId:
        return handleUnprocessableEntity(response, exception)

      default: {
        console.error(exception)

        return handleInternalError(response)
      }
    }
  }

  response.status(201).end()
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'POST')
    .status(405)
    .json({
      code: 'create-user-method-not-allowed',
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
      code: 'create-user-bad-request',
      message: 'Invalid request',
      errors: validationException.exceptions,
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'create-user-internal-server-error',
      message: 'Something went wrong while processing request',
    })
}

function handleConflict (response: NextApiResponse, exception: CreateUserApplicationException) {
  let exceptionCode: string

  if (exception.id === CreateUserApplicationException.emailAlreadyRegisteredId) {
    exceptionCode = 'create-user-conflict-email-already-registered'
  } else {
    exceptionCode = 'create-user-conflict-username-already-registered'
  }

  return response.status(409)
    .json({
      code: exceptionCode,
      message: exception.message,
    })
}

function handleUnprocessableEntity (response: NextApiResponse, exception: CreateUserApplicationException) {
  let exceptionCode: string

  switch (exception.id) {
    case CreateUserApplicationException.invalidNameId:
      exceptionCode = 'create-user-unprocessable-entity-invalid-name'
      break

    case CreateUserApplicationException.invalidUsernameId:
      exceptionCode = 'create-user-unprocessable-entity-invalid-username'
      break

    case CreateUserApplicationException.invalidEmailId:
      exceptionCode = 'create-user-unprocessable-entity-invalid-email'
      break

    case CreateUserApplicationException.invalidPasswordId:
      exceptionCode = 'create-user-unprocessable-entity-invalid-password'
      break

    default:
      exceptionCode = 'create-user-unprocessable-entity'
  }

  return response.status(422)
    .json({
      code: exceptionCode,
      message: exception.message,
    })
}

function handleUnauthorized (response: NextApiResponse) {
  return response.status(401)
    .json({
      code: 'create-user-unauthorized',
      message: 'Token is invalid or expired',
    })
}
