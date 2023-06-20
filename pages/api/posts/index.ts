import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApiRequestValidator } from '~/modules/Posts/Infrastructure/Validators/GetPostsApiRequestValidator'
import { GetPostsRequestDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/GetPostsRequestDtoTranslator'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import {
  GetPostsApiFilterRequestDto,
  GetPostsApiRequestDto
} from '~/modules/Posts/Infrastructure/Dtos/GetPostsApiRequestDto'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'
import { container } from '~/awailix.container'

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

  const useCase = container.resolve<GetPosts>('getPosts')

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
      case GetPostsApplicationException.invalidSortingOptionId:
      case GetPostsApplicationException.invalidFilterTypeId:
      case GetPostsApplicationException.invalidFilterValueId:
      case GetPostsApplicationException.invalidPerPageValueId:
      case GetPostsApplicationException.invalidPageValueId:
        return handleBadRequest(response, exception)

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
    order, orderBy,
  } = query

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

  return {
    ...page ? { page: parseInt(page.toString()) } : {},
    ...perPage ? { perPage: parseInt(perPage.toString()) } : {},
    ...orderBy ? { orderBy: orderBy.toString() } : {},
    ...order ? { order: order.toString() } : {},
    filters,
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
    .json({
      code: 'get-posts-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: 'get-posts-bad-request',
      message: 'Invalid request body',
      errors: validationError.exceptions,
    })
}

function handleBadRequest (
  response: NextApiResponse,
  exception: GetPostsApplicationException
) {
  return response.status(400)
    .json({
      code: 'get-posts-bad-request',
      message: exception.message,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'get-posts-server-error',
      message: 'Something went wrong while processing the request',
    })
}
