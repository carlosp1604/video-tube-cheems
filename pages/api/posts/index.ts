import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApiRequestValidator } from '~/modules/Shared/Infrastructure/Api/GetPostsApiRequestValidator'
import {
  GetPostsRequestDtoTranslator
} from '~/modules/Shared/Infrastructure/Api/GetPostsRequestDtoTranslator'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import {
  GetPostsApiRequestDto
} from '~/modules/Shared/Infrastructure/Api/GetPostsApiRequestDto'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import { container } from '~/awilix.container'
import {
  POST_INVALID_FILTER_TYPE, POST_INVALID_FILTER_VALUE, POST_INVALID_PAGE, POST_INVALID_PER_PAGE,
  POST_INVALID_SORTING_CRITERIA,
  POST_INVALID_SORTING_OPTION, POST_METHOD, POST_SERVER_ERROR, POST_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { GetPostsQueryParser } from '~/modules/Shared/Infrastructure/Api/GetPostsQueryParser'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const parsedQuery = GetPostsQueryParser.parseQuery(request.query)

  const validationError = GetPostsApiRequestValidator.validate(parsedQuery)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const apiRequest = parsedQuery as GetPostsApiRequestDto

  const applicationRequest = GetPostsRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const posts = await useCase.get(applicationRequest)

    return response
      .status(200)
      .setHeader('Cache-Control', 'public, max-age=60, must-revalidate')
      .json(posts)
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
