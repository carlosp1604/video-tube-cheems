import { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import { AddProducerViewApiRequestDto } from '~/modules/Producers/Infrastructure/Api/AddProducerViewApiRequestDto'
import { AddProducerViewRequestValidator } from '~/modules/Producers/Infrastructure/Api/AddProducerViewRequestValidator'
import { AddProducerView } from '~/modules/Producers/Application/AddProducerView/AddProducerView'
import {
  AddProducerViewApplicationException
} from '~/modules/Producers/Application/AddProducerView/AddProducerViewApplicationException'
import {
  PRODUCER_BAD_REQUEST,
  PRODUCER_METHOD, PRODUCER_PRODUCER_NOT_FOUND, PRODUCER_SERVER_ERROR,
  PRODUCER_VALIDATION
} from '~/modules/Producers/Infrastructure/Api/ProducerApiExceptionCodes'
import {
  ProducerApiRequestValidatorError
} from '~/modules/Producers/Infrastructure/Api/ProducerApiRequestValidatorError'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(request, response)
  }

  const { producerId } = request.query

  if (!producerId) {
    return handleBadRequest(response)
  }

  const apiRequest: AddProducerViewApiRequestDto = {
    producerId: String(producerId),
  }

  const validationError = AddProducerViewRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const useCase = container.resolve<AddProducerView>('addProducerViewUseCase')

  try {
    await useCase.add({ producerId: apiRequest.producerId })

    response.status(201).end()
  } catch (exception: unknown) {
    if (!(exception instanceof AddProducerViewApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case AddProducerViewApplicationException.producerNotFoundId:
        return handleNotFound(response, PRODUCER_PRODUCER_NOT_FOUND, exception.message)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'POST')
    .json({
      code: PRODUCER_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: ProducerApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: PRODUCER_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: PRODUCER_BAD_REQUEST,
      message: 'producerId parameter is required',
    })
}

function handleNotFound (
  response: NextApiResponse,
  code: string,
  message: string
) {
  return response.status(404)
    .json({
      code,
      message,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: PRODUCER_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
