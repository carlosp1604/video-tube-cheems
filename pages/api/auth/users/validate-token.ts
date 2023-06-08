import type { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awailix.container'
import { ValidateToken } from '~/modules/Auth/Application/ValidateToken/ValidateToken'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import {
  ValidateTokenApiRequestValidator
} from '~/modules/Auth/Infrastructure/Validators/ValidateTokenApiRequestValidator'
import {
  ValidateTokenApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/Translators/ValidateTokenApplicationRequestTranslator'
import {
  ValidateTokenApplicationException
} from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(response)
  }

  const { email, token } = request.query

  const apiRequest: any = {
    ...email ? { email: email.toString() } : {},
    ...token ? { token: token.toString() } : {},
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
      case ValidateTokenApplicationException.tokenDoesNotMatchId:
        return handleNotFound(response)
      case ValidateTokenApplicationException.cannotUseRecoverPasswordTokenId:
      case ValidateTokenApplicationException.cannotUseCreateAccountTokenId:
        /**
         * Log exception and obfuscate response. This should not happen
         * Maybe in thew future this could be handled in a different way
         */
        console.error(exception)

        return handleNotFound(response)

      default: {
        console.error(exception)

        return handleInternalError(response)
      }
    }
  }
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
  validationException: UserApiValidationException
) {
  return response
    .status(400)
    .json({
      code: 'validate-token-bad-request',
      message: 'Invalid request',
      errors: validationException.exceptions,
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'validate-token-internal-server-error',
      message: 'Something went wrong while processing request',
    })
}
