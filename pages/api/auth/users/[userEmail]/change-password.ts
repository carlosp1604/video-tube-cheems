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
import { container } from '~/awilix.container'
import {
  USER_BAD_REQUEST,
  USER_INVALID_PASSWORD,
  USER_INVALID_VERIFICATION_TOKEN,
  USER_METHOD, USER_SERVER_ERROR,
  USER_USER_NOT_FOUND, USER_VALIDATION
} from '~/modules/Auth/Infrastructure/AuthApiExceptionCodes'
import {
  ChangeUserPasswordApiRequestInterface
} from '~/modules/Auth/Infrastructure/Dtos/ChangeUserPasswordApiRequestInterface'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'PATCH') {
    return handleMethod(response)
  }

  const { userEmail } = request.query

  if (!userEmail) {
    return handleBadRequest(response)
  }

  const apiRequest: ChangeUserPasswordApiRequestInterface = {
    ...request.body,
    email: String(userEmail),
  }

  const validationExceptions = ChangeUserPasswordApiRequestValidator.validate(apiRequest)

  if (validationExceptions) {
    return handleValidation(response, validationExceptions)
  }

  const applicationRequest = ChangeUserPasswordApplicationRequestTranslator.fromApi(apiRequest)
  const useCase: ChangeUserPassword = container.resolve<ChangeUserPassword>('changeUserPasswordUseCase')

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
      case ChangeUserPasswordApplicationException.verificationTokenNotFoundId:
      case ChangeUserPasswordApplicationException.tokenDoesNotMatchId:
        return handleUnauthorized(response)
      case ChangeUserPasswordApplicationException.invalidPasswordId:
        return handleUnprocessableEntity(response)

      default: {
        console.error(exception)

        return handleInternalError(response)
      }
    }
  }

  return response.status(204).end()
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'PATCH')
    .status(405)
    .json({
      code: USER_METHOD,
      message: 'HTTP method not allowed',
    })
}

function handleNotFound (response: NextApiResponse) {
  return response.status(404)
    .json({
      code: USER_USER_NOT_FOUND,
      message: 'User associated to token was not found',
    })
}

function handleUnauthorized (response: NextApiResponse) {
  return response.status(401)
    .json({
      code: USER_INVALID_VERIFICATION_TOKEN,
      message: 'Token is invalid or expired',
    })
}

function handleUnprocessableEntity (response: NextApiResponse) {
  return response.status(422)
    .json({
      code: USER_INVALID_PASSWORD,
      message: 'Provided password is not valid',
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: USER_BAD_REQUEST,
      message: 'userEmail parameter is required',
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
