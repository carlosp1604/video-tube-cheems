import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApiRequestValidator } from '~/modules/Posts/Infrastructure/Api/Validators/GetPostsApiRequestValidator'
import {
  GetPostsRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/GetPostsRequestDtoTranslator'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import {
  GetPostsApiFilterRequestDto,
  GetPostsApiRequestDto
} from '~/modules/Posts/Infrastructure/Dtos/GetPostsApiRequestDto'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import { container } from '~/awilix.container'
import {
  POST_INVALID_FILTER_TYPE, POST_INVALID_FILTER_VALUE, POST_INVALID_PAGE, POST_INVALID_PER_PAGE,
  POST_INVALID_SORTING_CRITERIA,
  POST_INVALID_SORTING_OPTION, POST_METHOD, POST_SERVER_ERROR, POST_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const parsedQuery = parseQuery(request.query)

  const validationError = GetPostsApiRequestValidator.validate(parsedQuery)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const apiRequest = parsedQuery as GetPostsApiRequestDto

  const applicationRequest = GetPostsRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const posts = await useCase.get(applicationRequest)

    return response.status(200).json(posts)
  } catch (exception: unknown) {
    if (!(exception instanceof GetPostsApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case GetPostsApplicationException.invalidSortingCriteriaId:
        return handleUnprocessableEntity(response, exception, POST_INVALID_SORTING_CRITERIA)

      case GetPostsApplicationException.invalidSortingOptionId:
        return handleUnprocessableEntity(response, exception, POST_INVALID_SORTING_OPTION)

      case GetPostsApplicationException.invalidFilterTypeId:
        return handleUnprocessableEntity(response, exception, POST_INVALID_FILTER_TYPE)

      case GetPostsApplicationException.invalidFilterValueId:
        return handleUnprocessableEntity(response, exception, POST_INVALID_FILTER_VALUE)

      case GetPostsApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception, POST_INVALID_PER_PAGE)

      case GetPostsApplicationException.invalidPageValueId:
        return handleUnprocessableEntity(response, exception, POST_INVALID_PAGE)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

function parseQuery (query: NextApiRequestQuery): Partial<GetPostsApiRequestDto> {
  const {
    page,
    perPage,
    order,
    orderBy,
  } = query

  const filters: GetPostsApiFilterRequestDto[] = []

  for (const filter of Object.values(PostFilterOptions)) {
    const queryFilter = query[`${filter}`]

    if (queryFilter) {
      filters.push({
        type: filter,
        value: String(queryFilter),
      })
    }
  }

  return {
    ...page ? { page: parseInt(String(page)) } : {},
    ...perPage ? { perPage: parseInt(String(perPage)) } : {},
    ...orderBy ? { orderBy: String(orderBy) } : {},
    ...order ? { order: String(order) } : {},
    filters,
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
    .json({
      code: POST_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: POST_VALIDATION,
      message: 'Invalid request body',
      errors: validationError.exceptions,
    })
}

function handleUnprocessableEntity (
  response: NextApiResponse,
  exception: GetPostsApplicationException,
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
      code: POST_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
