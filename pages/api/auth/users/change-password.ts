import type { NextApiRequest, NextApiResponse } from 'next'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import {
  ChangeUserPasswordApiRequestInterface
} from '~/modules/Auth/Infrastructure/ChangeUserPasswordApiRequestInterface'
import {
  ChangeUserPasswordApiRequestValidator
} from '~/modules/Auth/Infrastructure/ChangeUserPasswordApiRequestValidator'
import {
  ChangeUserPasswordApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/ChangeUserPasswordApplicationRequestTranslator'
import { ChangeUserPassword } from '~/modules/Auth/Application/ChangeUserPassword'
import {
  ChangeUserPasswordApplicationException
} from '~/modules/Auth/Application/ChangeUserPasswordApplicationException'
import { container } from '~/awailix.container'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'PATCH') {
    return handleMethod(response)
  }

  const body = request.body as ChangeUserPasswordApiRequestInterface
  const validationExceptions = ChangeUserPasswordApiRequestValidator.validate(body)

  if (validationExceptions) {
    return handleBadRequest(response, validationExceptions)
  }

  const applicationRequest = ChangeUserPasswordApplicationRequestTranslator.fromApi(body)
  const useCase = container.resolve<ChangeUserPassword>('changeUserPasswordUseCase')

  try {
    await useCase.change(applicationRequest)
  } catch (exception: unknown) {
    if (!(exception instanceof ChangeUserPasswordApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case ChangeUserPasswordApplicationException.userNotFoundId:
        return handleNotFound(response)
      case ChangeUserPasswordApplicationException.verificationTokenIsNotValidId:
        return response.status(422)
          .json({
            code: 'change-user-password-invalid-token',
            message: 'Token is not valid to perform this action',
          })

      default:
        return handleInternalError(response)
    }
  }

  response.status(204).end()
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'PATCH')
    .status(405)
    .json({
      code: 'change-user-password-method-not-allowed',
      message: 'HTTP method not allowed',
    })
}

function handleNotFound (response: NextApiResponse) {
  return response.status(404)
    .json({
      code: 'change-user-password-not-found',
      message: 'User associated to token was not found',
    })
}

function handleBadRequest (
  response: NextApiResponse,
  validationException: UserApiValidationException
) {
  return response
    .status(400)
    .json({
      code: 'change-user-password-bad-request',
      message: 'Invalid request',
      errors: validationException.exceptions,
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'change-user-password-internal-server-error',
      message: 'Something went wrong while processing request',
    })
}
