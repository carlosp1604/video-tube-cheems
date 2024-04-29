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
import {
  USER_BAD_REQUEST,
  USER_METHOD,
  USER_SAVED_POSTS_INVALID_FILTER_TYPE,
  USER_SAVED_POSTS_INVALID_FILTER_VALUE, USER_SAVED_POSTS_INVALID_PAGE,
  USER_SAVED_POSTS_INVALID_PER_PAGE,
  USER_SAVED_POSTS_INVALID_SORTING_CRITERIA,
  USER_SAVED_POSTS_INVALID_SORTING_OPTION, USER_SAVED_POSTS_MISSING_FILTER,
  USER_SERVER_ERROR,
  USER_VALIDATION
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { GetUserHistory } from '~/modules/Posts/Application/GetUserHistory/GetUserHistory'
import {
  GetUserHistoryApplicationException
} from '~/modules/Posts/Application/GetUserHistory/GetUserHistoryApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const { username: userId } = request.query

  if (!userId) {
    return handleBadRequest(response)
  }

  const apiRequest = GetPostsQueryParser.parseQuery(request.query)

  const validationError = GetPostsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest =
    GetPostsRequestDtoTranslator.fromApiDto(apiRequest as GetPostsApiRequestDto)

  const useCase = container.resolve<GetUserHistory>('getUserHistoryUseCase')

  try {
    const posts = await useCase.get(applicationRequest)

    return response.status(200).json(posts)
  } catch (exception: unknown) {
    if (!(exception instanceof GetUserHistoryApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case GetUserHistoryApplicationException.invalidSortingCriteriaId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_SORTING_CRITERIA)

      case GetUserHistoryApplicationException.invalidSortingOptionId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_SORTING_OPTION)

      case GetUserHistoryApplicationException.invalidFilterTypeId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_FILTER_TYPE)

      case GetUserHistoryApplicationException.invalidFilterValueId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_FILTER_VALUE)

      case GetUserHistoryApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_PER_PAGE)

      case GetUserHistoryApplicationException.invalidPageValueId:
        return handleUnprocessableEntity(response, exception, USER_SAVED_POSTS_INVALID_PAGE)

      case GetUserHistoryApplicationException.viewedByFilterMissingId:
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

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: USER_BAD_REQUEST,
      message: 'userId parameter is required',
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
