import type { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awailix.container'
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
      case VerifyEmailAddressApplicationException.emailAlreadyRegisteredId:
        return handleConflict(exception, response)
      case VerifyEmailAddressApplicationException.cannotCreateVerificationTokenId:
      case VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmailId:
      case VerifyEmailAddressApplicationException.invalidEmailAddressId:
      case VerifyEmailAddressApplicationException.invalidTokenTypeId:
        return handleUnprocessableEntity(response, exception)

      default: {
        console.error(exception)

        return handleInternalError(response)
      }
    }
  }

  response.status(201).end()
}

function handleConflict (exception: VerifyEmailAddressApplicationException, response: NextApiResponse) {
  let exceptionCode: string

  if (exception.id === VerifyEmailAddressApplicationException.existingTokenActiveId) {
    exceptionCode = 'verify-email-address-conflict-token-already-issued'
  } else {
    exceptionCode = 'verify-email-address-conflict-email-already-registered'
  }

  return response.status(409)
    .json({
      code: exceptionCode,
      message: exception.message,
    })
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', 'POST')
    .status(405)
    .json({
      code: 'verify-email-address-method-not-allowed',
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
      code: 'verify-email-address-bad-request',
      message: 'Invalid request',
      errors: validationException.exceptions,
    })
}

function handleUnprocessableEntity (response: NextApiResponse, exception: VerifyEmailAddressApplicationException) {
  let exceptionCode: string

  switch (exception.id) {
    case VerifyEmailAddressApplicationException.cannotCreateVerificationTokenId:
      exceptionCode = 'verify-email-address-cannot-create-verification-token'
      break

    case VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmailId:
      exceptionCode = 'verify-email-address-cannot-send-verification-token'
      break

    case VerifyEmailAddressApplicationException.invalidEmailAddressId:
      exceptionCode = 'verify-email-address-invalid-email-address'
      break

    case VerifyEmailAddressApplicationException.invalidTokenTypeId:
      exceptionCode = 'verify-email-address-invalid-email-token-type'
      break

    default:
      exceptionCode = 'verify-email-address-unprocessable-entity'
  }

  return response.status(422)
    .json({
      code: exceptionCode,
      message: exception.message,
    })
}

function handleNotFound (response: NextApiResponse) {
  return response.status(404)
    .json({
      code: 'verify-email-address-not-found',
      message: 'User associated to given email was not found',
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'verify-email-address-internal-server-error',
      message: 'Something went wrong while processing request',
    })
}
