import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApiRequestValidator } from '~/modules/Shared/Infrastructure/Api/GetPostsApiRequestValidator'
import {
  GetPostsRequestDtoTranslator
} from '~/modules/Shared/Infrastructure/Api/GetPostsRequestDtoTranslator'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import { container } from '~/awilix.container'
import { GetPostsQueryParser } from '~/modules/Shared/Infrastructure/Api/GetPostsQueryParser'
import { GetPostsApiRequestDto } from '~/modules/Shared/Infrastructure/Api/GetPostsApiRequestDto'
import { GetUserSavedPosts } from '~/modules/Posts/Application/GetUserSavedPosts/GetUserSavedPosts'
import {
  GetUserSavedPostsApplicationException
} from '~/modules/Posts/Application/GetUserSavedPosts/GetUserSavedPostsApplicationException'
import {
  USER_METHOD,
  USER_SAVED_POSTS_INVALID_FILTER_TYPE,
  USER_SAVED_POSTS_INVALID_FILTER_VALUE, USER_SAVED_POSTS_INVALID_PAGE,
  USER_SAVED_POSTS_INVALID_PER_PAGE,
  USER_SAVED_POSTS_INVALID_SORTING_CRITERIA,
  USER_SAVED_POSTS_INVALID_SORTING_OPTION, USER_SAVED_POSTS_MISSING_FILTER,
  USER_SERVER_ERROR,
  USER_VALIDATION
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const apiRequest = GetPostsQueryParser.parseQuery(request.query)

  const validationError = GetPostsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest =
    GetPostsRequestDtoTranslator.fromApiDto(apiRequest as GetPostsApiRequestDto)

  const useCase = container.resolve<GetUserSavedPosts>('getUserSavedPostsUseCase')

  try {
    const posts = await useCase.get(applicationRequest)

    return response.status(200).json(posts)
  } catch (exception: unknown) {
    if (!(exception instanceof GetUserSavedPostsApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case GetUserSavedPostsApplicationException.invalidSortingCriteriaId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_SORTING_CRITERIA)

      case GetUserSavedPostsApplicationException.invalidSortingOptionId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_SORTING_OPTION)

      case GetUserSavedPostsApplicationException.invalidFilterTypeId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_FILTER_TYPE)

      case GetUserSavedPostsApplicationException.invalidFilterValueId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_FILTER_VALUE)

      case GetUserSavedPostsApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_PER_PAGE)

      case GetUserSavedPostsApplicationException.invalidPageValueId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_PAGE)

      case GetUserSavedPostsApplicationException.savedByFilterMissingId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_MISSING_FILTER)

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
      code: USER_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: USER_VALIDATION,
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
      code: USER_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
