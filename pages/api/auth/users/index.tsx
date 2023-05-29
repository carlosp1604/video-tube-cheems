import type { NextApiRequest, NextApiResponse } from 'next'
import { CreateUser } from '~/modules/Auth/Application/CreateUser/CreateUser'
import { CreateUserApiRequestValidator } from '~/modules/Auth/Infrastructure/CreateUserApiRequestValidator'
import {
  CreateUserApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/CreateUserApplicationRequestTranslator'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import { CreateUserApplicationException } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationException'
import { CreateUserApiRequestInterface } from '~/modules/Auth/Infrastructure/CreateUserApiRequestInterface'
import { container } from '~/awailix.container'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  const method = request.method

  if (method !== 'POST') {
    return handleMethod(response)
  }

  const body = request.body as CreateUserApiRequestInterface
  const validationExceptions = CreateUserApiRequestValidator.validate(body)

  if (validationExceptions) {
    return handleBadRequest(response, validationExceptions)
  }

  const applicationRequest = CreateUserApplicationRequestTranslator.fromApi(body)
  const useCase = container.resolve<CreateUser>('createUserUseCase')

  try {
    await useCase.create(applicationRequest)
  } catch (exception: unknown) {
    console.log(exception)
    if (!(exception instanceof CreateUserApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case CreateUserApplicationException.emailAlreadyRegisteredId:
      case CreateUserApplicationException.usernameAlreadyRegisteredId:
        return response.status(409)
          .json({
            code: 'create-user-conflict',
            message: exception.message,
          })

      case CreateUserApplicationException.verificationTokenIsNotValidId:
        return response.status(422)
          .json({
            code: 'create-user-invalid-token',
            message: 'Token is not valid to perform this action',
          })

      case CreateUserApplicationException.invalidUsernameId:
      case CreateUserApplicationException.invalidEmailId:
        return response.status(400)
          .json({
            code: 'create-user-invalid-request',
            message: exception.message,
          })

      default:
        return handleInternalError(response)
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
