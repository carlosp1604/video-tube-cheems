import { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import {
  PRODUCER_BAD_REQUEST,
  PRODUCER_INVALID_PAGE,
  PRODUCER_INVALID_PER_PAGE,
  PRODUCER_INVALID_SORTING_CRITERIA,
  PRODUCER_INVALID_SORTING_OPTION, PRODUCER_METHOD, PRODUCER_SERVER_ERROR, PRODUCER_VALIDATION
} from '~/modules/Producers/Infrastructure/Api/ProducerApiExceptionCodes'
import {
  GetProducersApplicationException
} from '~/modules/Producers/Application/GetProducers/GetProducersApplicationException'
import {
  GetProducersApiFilterRequestDto,
  GetProducersApiRequestDto,
  UnprocessedGetProducersApiRequestDto
} from '~/modules/Producers/Infrastructure/Api/GetProducersApiRequestDto'
import { GetProducers } from '~/modules/Producers/Application/GetProducers/GetProducers'
import { GetProducersRequestDtoTranslator } from '~/modules/Producers/Infrastructure/GetProducersRequestDtoTranslator'
import {
  ProducerApiRequestValidatorError
} from '~/modules/Producers/Infrastructure/Api/ProducerApiRequestValidatorError'
import { GetProducersApiRequestValidator } from '~/modules/Producers/Infrastructure/Api/GetProducersApiRequestValidator'
import { GetProducersFilterStringTypeOptions } from '~/modules/Producers/Domain/ProducerFilterOption'

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

  const validationError = GetProducersApiRequestValidator.validate(unprocessedApiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const useCase = container.resolve<GetProducers>('getProducersUseCase')

  const applicationRequest =
    GetProducersRequestDtoTranslator.fromApiDto(unprocessedApiRequest as GetProducersApiRequestDto)

  try {
    const producers = await useCase.get(applicationRequest)

    return response.status(200).json(producers)
  } catch (exception: unknown) {
    if (!(exception instanceof GetProducersApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case GetProducersApplicationException.invalidSortingCriteriaId:
        return handleUnprocessableEntity(response, exception, PRODUCER_INVALID_SORTING_CRITERIA)

      case GetProducersApplicationException.invalidSortingOptionId:
        return handleUnprocessableEntity(response, exception, PRODUCER_INVALID_SORTING_OPTION)

      case GetProducersApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception, PRODUCER_INVALID_PER_PAGE)

      case GetProducersApplicationException.invalidPageValueId:
        return handleUnprocessableEntity(response, exception, PRODUCER_INVALID_PAGE)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

const parseUnprocessedQuery = (request: NextApiRequest): UnprocessedGetProducersApiRequestDto => {
  const { page, perPage, order, orderBy } = request.query

  let producersPage : number | undefined
  let producersPerPage : number | undefined

  if (page && !Array.isArray(page) && !isNaN(parseInt(String(page)))) {
    producersPage = parseInt(String(page))
  }

  if (perPage && !Array.isArray(perPage) && !isNaN(parseInt(String(perPage)))) {
    producersPerPage = parseInt(String(perPage))
  }

  const filters: GetProducersApiFilterRequestDto[] = []

  for (const filter of Object.values(GetProducersFilterStringTypeOptions)) {
    const queryFilter = request.query[`${filter}`]

    if (queryFilter) {
      filters.push({
        type: filter,
        value: String(queryFilter),
      })
    }
  }

  return {
    page: producersPage ?? page,
    perPage: producersPerPage ?? perPage,
    order,
    orderBy,
    filters,
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
    .json({
      code: PRODUCER_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: PRODUCER_BAD_REQUEST,
      message: 'page, perPage, order and orderBy parameters are required',
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: ProducerApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: PRODUCER_VALIDATION,
      message: 'Some or all parameters are no valid. Invalid type or invalid value',
      errors: validationError.exceptions,
    })
}

function handleUnprocessableEntity (
  response: NextApiResponse,
  exception: GetProducersApplicationException,
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
      code: PRODUCER_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
