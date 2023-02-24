import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { GetActors } from '../../../modules/Actors/Application/GetActors'
import { GetActorsApplicationException } from '../../../modules/Actors/Application/GetActorsApplicationException'
import { GetActorsFilterOptions } from '../../../modules/Actors/Application/GetActorsRequestDto'
import { ActorApiRequestValidatorError } from '../../../modules/Actors/Infrastructure/ActorApiRequestValidatorError'
import { ActorFilterOptions } from '../../../modules/Actors/Infrastructure/ActorFilter'
import { bindings } from '../../../modules/Actors/Infrastructure/Bindings'
import { GetActorsApiRequestDto } from '../../../modules/Actors/Infrastructure/GetActorsApiRequestDto'
import { GetActorsApiRequestValidator } from '../../../modules/Actors/Infrastructure/GetActorsApiRequestValidator'
import { GetActorsRequestDtoTranslator } from '../../../modules/Actors/Infrastructure/GetActorsRequestDtoTranslator'
import { InfrastructureFilter } from '../../../modules/Shared/Infrastructure/InfrastructureFilter'
import { SortingInfrastructureCriteriaType, SortingInfrastructureOptionsType } from '../../../modules/Shared/Infrastructure/InfrastructureSorting'

export default async function handler(
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

  const useCase = bindings.get<GetActors>('GetActors')

  const applicationRequest = GetActorsRequestDtoTranslator.fromApiDto(apiRequest)

  try {
    const actors = await useCase.get(applicationRequest)

    return response.status(201).json(actors)
  }
  catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof GetActorsApplicationException)) {
      return handleServerError(response)
    }

    return handleBadRequest(exception, response)
  }
}

function parseQuery(query: NextApiRequestQuery): GetActorsApiRequestDto {
  const { page, perPage, order, orderBy } = query
  const filters: InfrastructureFilter<GetActorsFilterOptions>[] = []
  for (const filter of Object.keys(ActorFilterOptions)) {
    const queryFilter = query[`${filter}`]

    if (queryFilter) {
      filters.push({
        type: filter as GetActorsFilterOptions,
        value: queryFilter.toString()
      })
    }
  }

  const pageNumber = parseInt(page ? page.toString() : '0')
  const actorsPerPage = parseInt(perPage ? perPage.toString() : '0')
  const sortOption = orderBy ? orderBy.toString() : 'date'
  const sortCriteria = order ? order.toString() : 'desc'

  return {
    page: pageNumber,
    actorsPerPage: actorsPerPage,
    sortCriteria: sortCriteria as SortingInfrastructureCriteriaType,
    sortOption: sortOption as SortingInfrastructureOptionsType,
    filters
  }
}

function handleMethod(request: NextApiRequest,response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
    .json({
      code: 'get-actor-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`
    })
}

function handleBadRequest(exception: GetActorsApplicationException, response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: 'get-actor-bad-request',
      message: exception.message
    })
}

function handleValidationError(
  response: NextApiResponse,
  validationError: ActorApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: 'get-actor-validation-exception',
      message: 'Passed Actor ID is not valid',
      errors: validationError.exceptions
    })
}

function handleServerError(response: NextApiResponse,) {
  return response.status(500)
    .json({
      code: 'get-actor-server-error',
      message: 'Something went wrong while processing the request'
    })
}
