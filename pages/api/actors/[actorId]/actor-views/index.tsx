import { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import { AddActorViewApiRequestDto } from '~/modules/Actors/Infrastructure/Api/AddActorViewApiRequestDto'
import { AddActorViewRequestValidator } from '~/modules/Actors/Infrastructure/Api/AddActorViewRequestValidator'
import { AddActorView } from '~/modules/Actors/Application/AddActorView/AddActorView'
import {
  ACTOR_ACTOR_NOT_FOUND,
  ACTOR_BAD_REQUEST,
  ACTOR_METHOD, ACTOR_SERVER_ERROR,
  ACTOR_VALIDATION
} from '~/modules/Actors/Infrastructure/Api/ActorApiExceptionCodes'
import {
  AddActorViewApplicationException
} from '~/modules/Actors/Application/AddActorView/AddActorViewApplicationException'
import { ActorsApiRequestValidatorError } from '~/modules/Actors/Infrastructure/Api/ActorsApiRequestValidatorError'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(request, response)
  }

  const { actorId } = request.query

  if (!actorId) {
    return handleBadRequest(response)
  }

  const apiRequest: AddActorViewApiRequestDto = {
    actorId: String(actorId),
  }

  const validationError = AddActorViewRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const useCase = container.resolve<AddActorView>('addActorViewUseCase')

  try {
    await useCase.add({ actorId: apiRequest.actorId })

    response.status(201).end()
  } catch (exception: unknown) {
    if (!(exception instanceof AddActorViewApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case AddActorViewApplicationException.actorNotFoundId:
        return handleNotFound(response, ACTOR_ACTOR_NOT_FOUND, exception.message)

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
      code: ACTOR_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: ActorsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: ACTOR_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: ACTOR_BAD_REQUEST,
      message: 'actorId parameter is required',
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
      code: ACTOR_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
