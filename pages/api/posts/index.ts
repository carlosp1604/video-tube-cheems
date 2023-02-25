import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApiRequestDto } from '../../../modules/Posts/Infrastructure/Dtos/GetPostsApiRequestDto'
import {
  GetPostsApiRequestValidator
} from '../../../modules/Posts/Infrastructure/Validators/GetPostsApiRequestValidator'
import { GetPostsRequestDtoTranslator } from '../../../modules/Posts/Infrastructure/GetPostsRequestDtoTranslator'
import { GetPosts } from '../../../modules/Posts/Application/GetPosts'
import { bindings } from '../../../modules/Posts/Infrastructure/Bindings'
import { GetPostsApplicationException } from '../../../modules/Posts/Application/GetPostsApplicationException'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { SortingInfrastructureCriteriaType, SortingInfrastructureOptionsType } from '../../../modules/Shared/Infrastructure/InfrastructureSorting'
import { PostFilterOptions } from '../../../modules/Posts/Infrastructure/PostFilters'
import { InfrastructureFilter } from '../../../modules/Shared/Infrastructure/InfrastructureFilter'
import { GetPostsFilterOptions } from '../../../modules/Posts/Application/Dtos/GetPostsRequestDto'
import { PostsApiRequestValidatorError } from '../../../modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const apiRequest = parseQuery(request.query)

  const validationError = GetPostsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const applicationRequest = GetPostsRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = bindings.get<GetPosts>('GetPosts')

  try {
    const posts = await useCase.get(applicationRequest)

    return response.status(200).json(posts)
  }
  catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof GetPostsApplicationException)) {
      return handleServerError(response)
    }

    console.error(exception)
    return handleServerError(response)
  }
}

function parseQuery(query: NextApiRequestQuery): GetPostsApiRequestDto {
  const { page, perPage, order, orderBy } = query
  const filters: InfrastructureFilter<GetPostsFilterOptions>[] = []
  for (const filter of Object.keys(PostFilterOptions)) {
    const queryFilter = query[`${filter}`]

    if (queryFilter) {
      filters.push({
        type: filter as GetPostsFilterOptions,
        value: queryFilter.toString()
      })
    }
  }

  const pageNumber = parseInt(page ? page.toString() : '0')
  const postsPerPage = parseInt(perPage ? perPage.toString() : '0')
  const sortOption = orderBy ? orderBy.toString() : 'date'
  const sortCriteria = order ? order.toString() : 'desc'

  return {
    page: pageNumber,
    postsPerPage: postsPerPage,
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
      code: 'get-posts-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`
    })
}

function handleValidationError(
  request: NextApiRequest,
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: 'get-posts-validation-exception',
      message: 'Invalid request body',
      errors: validationError.exceptions
    })
}

function handleServerError(response: NextApiResponse,) {
  return response.status(500)
    .json({
      code: 'get-posts-comment-server-error',
      message: 'Something went wrong while processing the request'
    })
}
