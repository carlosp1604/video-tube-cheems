import type { NextApiRequest, NextApiResponse } from 'next'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import {
  VerifyEmailAddressApplicationException
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationException'
import { RecoverPasswordApiRequestInterface } from '~/modules/Auth/Infrastructure/RecoverPasswordApiRequestInterface'
import { RecoverPasswordApiRequestValidator } from '~/modules/Auth/Infrastructure/RecoverPasswordApiRequestValidator'
import { RecoverPassword } from '~/modules/Auth/Application/RecoverPassword'
import {
  RecoverPasswordApplicationTranslator
} from '~/modules/Auth/Infrastructure/RecoverPasswordApplicationTranslator'
import { RecoverPasswordApplicationException } from '~/modules/Auth/Application/RecoverPasswordApplicationException'
import { container } from '~/awailix.container'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(response)
  }

  const apiRequest = request.body as RecoverPasswordApiRequestInterface
  const validationExceptions = RecoverPasswordApiRequestValidator.validate(apiRequest)

  if (validationExceptions) {
    return handleBadRequest(response, validationExceptions)
  }

  const applicationRequest = RecoverPasswordApplicationTranslator.fromApi(apiRequest)
  const useCase = container.resolve<RecoverPassword>('recoverPasswordUseCase')

  try {
    await useCase.recover(applicationRequest)
  } catch (exception: unknown) {
    if (!(exception instanceof RecoverPasswordApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case RecoverPasswordApplicationException.existingTokenActiveId:
        return handleConflict(exception, response)

      case RecoverPasswordApplicationException.userNotFoundId:
        return handleNotFound(response)

      case RecoverPasswordApplicationException.cannotSendVerificationTokenEmailId:
        return handleBadRequest(response, null)

      default:
        return handleInternalError(response)
    }
  }

  response.status(201).end()
}

function handleNotFound (response: NextApiResponse) {
  return response.status(404)
    .json({
      code: 'recover-password-not-found',
      message: 'User associated to token was not found',
    })
}

function handleConflict (exception: VerifyEmailAddressApplicationException, response: NextApiResponse) {
  return response.status(409)
    .json({
      code: 'recover-password-conflict',
      message: exception.message,
    })
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'POST')
    .status(405)
    .json({
      code: 'recover-password-method-not-allowed',
      message: 'HTTP method not allowed',
    })
}

function handleBadRequest (
  response: NextApiResponse,
  validationException: UserApiValidationException | null
) {
  return response
    .status(400)
    .json({
      code: 'recover-password-bad-request',
      message: 'Invalid request',
      ...validationException !== null ? { errors: validationException.exceptions } : {},
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'recover-password-internal-server-error',
      message: 'Something went wrong while processing request',
    })
}
