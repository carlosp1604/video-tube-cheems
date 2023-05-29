import type { NextApiRequest, NextApiResponse } from 'next'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import {
  VerifyEmailAddressApplicationException
} from '~/modules/Auth/Application/VerifyEmailAddressApplicationException'
import { ValidateTokenApiRequestValidator } from '~/modules/Auth/Infrastructure/ValidateTokenApiRequestValidator'
import { ValidateTokenApiRequestInterface } from '~/modules/Auth/Infrastructure/ValidateTokenApiRequestInterface'
import { ValidateToken } from '~/modules/Auth/Application/ValidateToken'
import {
  ValidateTokenApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/ValidateTokenApplicationRequestTranslator'
import { container } from '~/awailix.container'
import { ValidateTokenApplicationException } from '~/modules/Auth/Application/ ValidateTokenApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(response)
  }

  const { email, token } = request.query

  if (!email || !token) {
    return handleBadRequest(response, null)
  }

  const apiRequest: ValidateTokenApiRequestInterface = {
    email: email.toString(),
    token: token.toString(),
  }

  const validationExceptions = ValidateTokenApiRequestValidator.validate(apiRequest)

  if (validationExceptions) {
    return handleBadRequest(response, validationExceptions)
  }

  const useCase = container.resolve<ValidateToken>('validateTokenUseCase')
  const applicationRequest = ValidateTokenApplicationRequestTranslator.fromApi(apiRequest)

  try {
    const token = await useCase.validate(applicationRequest)

    response.status(200).json(token)
  } catch (exception: unknown) {
    if (!(exception instanceof ValidateTokenApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case ValidateTokenApplicationException.verificationTokenNotFoundId:
        return handleNotFound(response)
      case ValidateTokenApplicationException.cannotUseRecoverPasswordTokenId:
      case ValidateTokenApplicationException.cannotUseVerifyEmailTokenId:
        // Log exception and obfuscate response. This should not happen
        console.error(exception)

        return handleNotFound(response)
      case ValidateTokenApplicationException.verificationTokenExpiredId:
        return handleConflict(exception, response)

      default:
        return handleInternalError(response)
    }
  }
}

function handleConflict (exception: VerifyEmailAddressApplicationException, response: NextApiResponse) {
  return response.status(409)
    .json({
      code: 'validate-token-conflict',
      message: exception.message,
    })
}

function handleNotFound (response: NextApiResponse) {
  return response.status(404)
    .json({
      code: 'validate-token-not-found',
      message: 'Token not found',
    })
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'GET')
    .status(405)
    .json({
      code: 'validate-token-method-not-allowed',
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
      code: 'validate-token-bad-request',
      message: 'Invalid request',
      ...validationException !== null
        ? { errors: validationException.exceptions }
        : { errors: [{ message: 'Token and Email are required' }] },
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'validate-token-internal-server-error',
      message: 'Something went wrong while processing request',
    })
}
