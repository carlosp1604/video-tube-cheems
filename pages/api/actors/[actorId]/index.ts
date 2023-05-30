import { NextApiRequest, NextApiResponse } from 'next'
import { GetActor } from '../../../../modules/Actors/Application/GetActor'
import { GetActorApplicationException } from '../../../../modules/Actors/Application/GetActorApplicationException'
import { ActorApiRequestValidatorError } from '../../../../modules/Actors/Infrastructure/ActorApiRequestValidatorError'
import { bindings } from '../../../../modules/Actors/Infrastructure/Bindings'
import { GetActorApiRequestValidator } from '../../../../modules/Actors/Infrastructure/GetActorApiRequestValidator'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const { actorId } = request.query

  if (!actorId) {
    return handleBadRequest(response)
  }

  const validationError =
    GetActorApiRequestValidator.validate(actorId.toString())

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const useCase = bindings.get<GetActor>('GetActor')

  try {
    const actor = await useCase.get(actorId.toString())

    return response.status(201).json(actor)
  } catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof GetActorApplicationException)) {
      return handleServerError(response)
    }

    if (exception.id === GetActorApplicationException.actorNotFoundId) {
      return handleNotFound(response)
    }

    console.error(exception)

    return handleServerError(response)
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
    .json({
      code: 'get-actor-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: 'get-actor-bad-request',
      message: 'Actor ID required',
    })
}

function handleNotFound (response: NextApiResponse) {
  return response
    .status(404)
    .json({
      code: 'get-actor-actor-not-found',
      message: 'Actor not found',
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: ActorApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: 'get-actor-validation-exception',
      message: 'Passed Actor ID is not valid',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'get-actor-server-error',
      message: 'Something went wrong while processing the request',
    })
}
