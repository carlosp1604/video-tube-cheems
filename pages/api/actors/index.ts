import { NextApiRequest, NextApiResponse } from 'next'
import { GetActorsApiRequestValidator } from '~/modules/Actors/Infrastructure/Api/GetActorsApiRequestValidator'
import { container } from '~/awilix.container'
import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import { GetActorsRequestDtoTranslator } from '~/modules/Actors/Infrastructure/GetActorsRequestDtoTranslator'
import { GetActorsApplicationException } from '~/modules/Actors/Application/GetActors/GetActorsApplicationException'
import { ActorsApiRequestValidatorError } from '~/modules/Actors/Infrastructure/Api/ActorsApiRequestValidatorError'
import {
  GetActorsApiRequestDto,
  UnprocessedGetActorsApiRequestDto
} from '~/modules/Actors/Infrastructure/Api/GetActorsApiRequestDto'
import {
  ACTOR_BAD_REQUEST,
  ACTOR_INVALID_PAGE,
  ACTOR_INVALID_PER_PAGE,
  ACTOR_INVALID_SORTING_CRITERIA,
  ACTOR_INVALID_SORTING_OPTION,
  ACTOR_METHOD,
  ACTOR_SERVER_ERROR,
  ACTOR_VALIDATION
} from '~/modules/Actors/Infrastructure/Api/ActorApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const { page, perPage, order, orderBy } = request.query

  if (!page || !perPage || !orderBy || !order) {
    return handleBadRequest(response)
  }

  const unprocessedApiRequest = parseUnprocessedQuery(request)

  const validationError = GetActorsApiRequestValidator.validate(unprocessedApiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const useCase = container.resolve<GetActors>('getActorsUseCase')

  const applicationRequest = GetActorsRequestDtoTranslator.fromApiDto(unprocessedApiRequest as GetActorsApiRequestDto)

  try {
    const actors = await useCase.get(applicationRequest)

    return response.status(200).json(actors)
  } catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof GetActorsApplicationException)) {
      return handleServerError(response)
    }

    switch (exception.id) {
      case GetActorsApplicationException.invalidSortingCriteriaId:
        return handleUnprocessableEntity(response, exception, ACTOR_INVALID_SORTING_CRITERIA)

      case GetActorsApplicationException.invalidSortingOptionId:
        return handleUnprocessableEntity(response, exception, ACTOR_INVALID_SORTING_OPTION)

      case GetActorsApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception, ACTOR_INVALID_PER_PAGE)

      case GetActorsApplicationException.invalidPageValueId:
        return handleUnprocessableEntity(response, exception, ACTOR_INVALID_PAGE)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

const parseUnprocessedQuery = (request: NextApiRequest): UnprocessedGetActorsApiRequestDto => {
  const { page, perPage, order, orderBy } = request.query

  let actorsPage : number | undefined
  let actorsPerPage : number | undefined

  if (page && !Array.isArray(page) && !isNaN(parseInt(String(page)))) {
    actorsPage = parseInt(String(page))
  }

  if (perPage && !Array.isArray(perPage) && !isNaN(parseInt(String(perPage)))) {
    actorsPerPage = parseInt(String(perPage))
  }

  return {
    page: actorsPage ?? page,
    perPage: actorsPerPage ?? perPage,
    order,
    orderBy,
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
    .json({
      code: ACTOR_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: ACTOR_BAD_REQUEST,
      message: 'page, perPage, order and orderBy parameters are required',
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: ActorsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: ACTOR_VALIDATION,
      message: 'Some or all parameters are no valid. Invalid type or invalid value',
      errors: validationError.exceptions,
    })
}

function handleUnprocessableEntity (
  response: NextApiResponse,
  exception: GetActorsApplicationException,
  code: string
) {
  return response.status(422)
    .json({
      code,
      message: exception.message,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: ACTOR_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
