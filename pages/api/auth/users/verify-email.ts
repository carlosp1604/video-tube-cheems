import type { NextApiRequest, NextApiResponse } from 'next'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import {
  VerifyEmailAddressApiRequestValidator
} from '~/modules/Auth/Infrastructure/VerifyEmailAddressApiRequestValidator'
import { VerifyEmailAddress } from '~/modules/Auth/Application/VerifyEmailAddress'
import {
  VerifyEmailAddressApiRequestInterface
} from '~/modules/Auth/Infrastructure/VerifyEmailAddressApiRequestInterface'
import {
  VerifyEmailAddressApplicationException
} from '~/modules/Auth/Application/VerifyEmailAddressApplicationException'
import {
  VerifyEmailAddressApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/VerifyEmailAddressApplicationRequestTranslator'
import { container } from '~/awailix.container'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  const method = request.method

  if (method !== 'POST') {
    return handleMethod(response)
  }

  console.log(request.body)

  const apiRequest = JSON.parse(request.body) as VerifyEmailAddressApiRequestInterface

  const validationExceptions = VerifyEmailAddressApiRequestValidator.validate(apiRequest)

  if (validationExceptions) {
    return handleBadRequest(response, validationExceptions)
  }

  const useCase = container.resolve<VerifyEmailAddress>('verifyEmailAddressUseCase')
  const applicationRequest = VerifyEmailAddressApplicationRequestTranslator.fromApi(apiRequest)

  try {
    await useCase.verify(applicationRequest)
  } catch (exception: unknown) {
    if (!(exception instanceof VerifyEmailAddressApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case VerifyEmailAddressApplicationException.existingTokenActiveId:
      case VerifyEmailAddressApplicationException.emailAlreadyRegisteredId:
        return handleConflict(exception, response)

      case VerifyEmailAddressApplicationException.cannotCreateVerificationTokenId:
        return handleBadRequest(response, null)

      case VerifyEmailAddressApplicationException.cannotSendVerificationTokenEmailId:
        return handleUnprocessableEntity(response)

      default:
        return handleInternalError(response)
    }
  }

  response.status(201).end()
}

function handleConflict (exception: VerifyEmailAddressApplicationException, response: NextApiResponse) {
  let code = 'verify-email-address-conflict'

  if (exception.id === VerifyEmailAddressApplicationException.existingTokenActiveId) {
    code += '-token-already-issued'
  } else {
    code += '-email-already-registered'
  }

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
      code: 'verify-email-address-method-not-allowed',
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
      code: 'verify-email-address-bad-request',
      message: 'Invalid request',
      ...validationException !== null ? { errors: validationException.exceptions } : {},
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'verify-email-address-internal-server-error',
      message: 'Something went wrong while processing request',
    })
}

function handleUnprocessableEntity (response: NextApiResponse) {
  return response.status(422)
    .json({
      code: 'verify-email-address-invalid-email-address',
      message: 'Email could not be sent due to email address is invalid',
    })
}
