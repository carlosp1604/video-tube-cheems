import type { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import { ValidateToken } from '~/modules/Auth/Application/ValidateToken/ValidateToken'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'
import {
  ValidateTokenApiRequestValidator
} from '~/modules/Auth/Infrastructure/Api/Validators/ValidateTokenApiRequestValidator'
import {
  ValidateTokenApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/Api/Translators/ValidateTokenApplicationRequestTranslator'
import {
  ValidateTokenApplicationException
} from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationException'
import {
  USER_BAD_REQUEST, USER_INVALID_VERIFICATION_TOKEN,
  USER_METHOD,
  USER_SERVER_ERROR, USER_TOKEN_NOT_FOUND,
  USER_VALIDATION
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { ValidateTokenApiRequestInterface } from '~/modules/Auth/Infrastructure/Dtos/ValidateTokenApiRequestInterface'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(response)
  }

  const { email, token } = request.query

  if (!email || !token) {
    return handleBadRequest(response)
  }

  const apiRequest: ValidateTokenApiRequestInterface = {
    email: String(email),
    token: String(token),
  }

  const validationExceptions = ValidateTokenApiRequestValidator.validate(apiRequest)

  if (validationExceptions) {
    return handleValidation(response, validationExceptions)
  }

  const useCase = container.resolve<ValidateToken>('validateTokenUseCase')
  const applicationRequest = ValidateTokenApplicationRequestTranslator.fromApi(apiRequest)

  try {
    const token = await useCase.validate(applicationRequest)

    return response.status(200).json(token)
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
        return handleUnauthorized(response)

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
      code: USER_TOKEN_NOT_FOUND,
      message: 'Token not found',
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

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: USER_BAD_REQUEST,
      message: 'email and token parameters are required',
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: USER_SERVER_ERROR,
      message: 'Something went wrong while processing request',
    })
}

function handleUnauthorized (response: NextApiResponse) {
  return response.status(401)
    .json({
      code: USER_INVALID_VERIFICATION_TOKEN,
      message: 'Token is invalid, expired or cannot be used for the required operation',
    })
}
