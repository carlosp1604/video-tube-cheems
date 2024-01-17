import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { GetActorsApiRequestValidator } from '~/modules/Actors/Infrastructure/Api/GetActorsApiRequestValidator'
import { container } from '~/awilix.container'
import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import { GetActorsRequestDtoTranslator } from '~/modules/Actors/Infrastructure/GetActorsRequestDtoTranslator'
import { GetActorsApplicationException } from '~/modules/Actors/Application/GetActors/GetActorsApplicationException'
import { GetPostsApiFilterRequestDto } from '~/modules/Shared/Infrastructure/Api/GetPostsApiRequestDto'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import { ActorApiRequestValidatorError } from '~/modules/Actors/Infrastructure/Api/ActorApiRequestValidatorError'
import { GetActorsApiRequestDto } from '~/modules/Actors/Infrastructure/Api/GetActorsApiRequestDto'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const apiRequest = parseQuery(request.query)

  const validationError =
    GetActorsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const useCase = container.resolve<GetActors>('getActors')

  const applicationRequest = GetActorsRequestDtoTranslator.fromApiDto(apiRequest)

  try {
    const actors = await useCase.get(applicationRequest)

    return response.status(201).json(actors)
  } catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof GetActorsApplicationException)) {
      return handleServerError(response)
    }

    return handleBadRequest(exception, response)
  }
}

function parseQuery (query: NextApiRequestQuery): GetActorsApiRequestDto {
  const { page, perPage, order, orderBy } = query
  const filters: GetPostsApiFilterRequestDto[] = []

  for (const filter of Object.values(PostFilterOptions)) {
    const queryFilter = query[`${filter}`]

    if (queryFilter) {
      filters.push({
        type: filter,
        value: queryFilter.toString(),
      })
    }
  }

  const pageNumber = parseInt(page ? page.toString() : '0')
  const actorsPerPage = parseInt(perPage ? perPage.toString() : '0')
  const sortOption = orderBy ? orderBy.toString() : InfrastructureSortingOptions.DATE
  const sortCriteria = order ? order.toString() : 'desc'

  return {
    page: pageNumber,
    actorsPerPage,
    sortCriteria: sortCriteria as InfrastructureSortingCriteria,
    sortOption: sortOption as InfrastructureSortingOptions,
    // FIXME:
    filters: 'actorId',
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
    .json({
      code: 'get-actors-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleBadRequest (exception: GetActorsApplicationException, response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: 'get-actors-bad-request',
      message: exception.message,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: ActorApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: 'get-actors-validation-exception',
      message: 'Passed Actor ID is not valid',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'get-actors-server-error',
      message: 'Something went wrong while processing the request',
    })
}
