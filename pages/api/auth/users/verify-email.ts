import type { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import { VerifyEmailAddress } from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddress'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import {
  VerifyEmailAddressApiRequestValidator
} from '~/modules/Auth/Infrastructure/Validators/VerifyEmailAddressApiRequestValidator'
import {
  VerifyEmailAddressApplicationException
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationException'
import {
  VerifyEmailAddressApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/Translators/VerifyEmailAddressApplicationRequestTranslator'
import {
  USER_CANNOT_SEND_VERIFICATION_EMAIL,
  USER_EMAIL_ALREADY_REGISTERED, USER_INVALID_EMAIL, USER_INVALID_TOKEN_TYPE,
  USER_METHOD,
  USER_SERVER_ERROR, USER_TOKEN_ALREADY_ISSUED,
  USER_USER_NOT_FOUND,
  USER_VALIDATION
} from '~/modules/Auth/Infrastructure/AuthApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(response)
  }

  const validationExceptions = VerifyEmailAddressApiRequestValidator.validate(request.body)

  if (validationExceptions) {
    return handleBadRequestValidationError(response, validationExceptions)
  }

  const useCase = container.resolve<VerifyEmailAddress>('verifyEmailAddressUseCase')
  const applicationRequest = VerifyEmailAddressApplicationRequestTranslator.fromApi(request.body)

  try {
    await useCase.verify(applicationRequest)
  } catch (exception: unknown) {
    if (!(exception instanceof VerifyEmailAddressApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case VerifyEmailAddressApplicationException.userNotFoundId:
        return handleNotFound(response)

      case VerifyEmailAddressApplicationException.existingTokenActiveId:
        return handleConflict(exception, response, USER_TOKEN_ALREADY_ISSUED)

      case VerifyEmailAddressApplicationException.emailAlreadyRegisteredId:
        return handleConflict(exception, response, USER_EMAIL_ALREADY_REGISTERED)

      case VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmailId:
        return handleUnprocessableEntity(response, exception, USER_CANNOT_SEND_VERIFICATION_EMAIL)

      case VerifyEmailAddressApplicationException.invalidEmailAddressId:
        return handleUnprocessableEntity(response, exception, USER_INVALID_EMAIL)

      case VerifyEmailAddressApplicationException.invalidTokenTypeId:
        return handleUnprocessableEntity(response, exception, USER_INVALID_TOKEN_TYPE)

      default: {
        console.error(exception)

        return handleInternalError(response)
      }
    }
  }

  return response.status(201).end()
}

function handleConflict (exception: VerifyEmailAddressApplicationException, response: NextApiResponse, code: string) {
  return response.status(409)
    .json({
      code,
      message: exception.message,
    })
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

function handleBadRequestValidationError (
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

function handleUnprocessableEntity (
  response: NextApiResponse,
  exception: VerifyEmailAddressApplicationException,
  code: string
) {
  return response.status(422)
    .json({
      code,
      message: exception.message,
    })
}

function handleNotFound (response: NextApiResponse) {
  return response.status(404)
    .json({
      code: USER_USER_NOT_FOUND,
      message: 'User associated to given email was not found',
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: USER_SERVER_ERROR,
      message: 'Something went wrong while processing request',
    })
}
