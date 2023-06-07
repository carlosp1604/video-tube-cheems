import type { NextApiRequest, NextApiResponse } from 'next'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import {
  ChangeUserPasswordApiRequestValidator
} from '~/modules/Auth/Infrastructure/Validators/ChangeUserPasswordApiRequestValidator'
import {
  ChangeUserPasswordApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/Translators/ChangeUserPasswordApplicationRequestTranslator'
import { ChangeUserPassword } from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPassword'
import {
  ChangeUserPasswordApplicationException
} from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPasswordApplicationException'
import { container } from '~/awailix.container'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'PATCH') {
    return handleMethod(response)
  }

  const validationExceptions = ChangeUserPasswordApiRequestValidator.validate(request.body)

  if (validationExceptions) {
    return handleBadRequest(response, validationExceptions)
  }

  const applicationRequest = ChangeUserPasswordApplicationRequestTranslator.fromApi(request.body)
  const useCase: ChangeUserPassword = container.resolve<ChangeUserPassword>('changeUserPasswordUseCase')

  try {
    await useCase.change(applicationRequest)
  } catch (exception: unknown) {
    if (!(exception instanceof ChangeUserPasswordApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    console.error(exception)

    switch (exception.id) {
      case ChangeUserPasswordApplicationException.userNotFoundId:
        return handleNotFound(response)
      case ChangeUserPasswordApplicationException.verificationTokenIsNotValidId:
      case ChangeUserPasswordApplicationException.verificationTokenNotFoundId:
      case ChangeUserPasswordApplicationException.tokenDoesNotMatchId:
        return handleUnauthorized(response)
      case ChangeUserPasswordApplicationException.invalidPasswordId:
        return handleUnprocessableEntity(response)

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

function handleUnauthorized (response: NextApiResponse) {
  return response.status(401)
    .json({
      code: 'change-user-password-unauthorized',
      message: 'Token is invalid or expired',
    })
}

function handleUnprocessableEntity (response: NextApiResponse) {
  return response.status(422)
    .json({
      code: 'change-user-password-unprocessable-entity',
      message: 'Provided password is not valid',
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
