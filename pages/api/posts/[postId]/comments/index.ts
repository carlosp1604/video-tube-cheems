import type { NextApiRequest, NextApiResponse } from 'next'
import {
  GetPostPostCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostPostCommentsApiRequestDto'
import {
  GetPostPostCommentsApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/GetPostPostCommentsApiRequestValidator'
import { GetPostPostComments } from '~/modules/Posts/Application/GetPostPostComments/GetPostPostComments'
import {
  CreatePostCommentApplicationException
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationException'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import {
  CreatePostCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentApiRequestDto'
import {
  CreatePostCommentRequestSanitizer
} from '~/modules/Posts/Infrastructure/Api/Sanitizers/CreatePostCommentRequestSanitizer'
import {
  CreatePostCommentApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/CreatePostCommentApiRequestValidator'
import {
  CreatePostCommentRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/CreatePostCommentRequestDtoTranslator'
import { CreatePostComment } from '~/modules/Posts/Application/CreatePostComment/CreatePostComment'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostCommentApiRequestValidatorError'
import { getServerSession } from 'next-auth/next'
import { container } from '~/awilix.container'
import {
  GetPostPostCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostComments/GetPostPostCommentsApplicationException'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import {
  POST_COMMENT_AUTH_REQUIRED,
  POST_COMMENT_BAD_REQUEST,
  POST_COMMENT_INVALID_PAGE,
  POST_COMMENT_INVALID_PER_PAGE,
  POST_COMMENT_METHOD,
  POST_COMMENT_POST_NOT_FOUND,
  POST_COMMENT_SERVER_ERROR, POST_COMMENT_USER_NOT_FOUND,
  POST_COMMENT_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import {
  GetPostPostCommentsRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/GetPostPostCommentsRequestDtoTranslator'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST':
      return handlePOST(request, response)

    case 'GET':
      return handleGET(request, response)

    default:
      return handleMethod(request, response)
  }
}

async function handleGET (request: NextApiRequest, response: NextApiResponse) {
  const { postId, page, perPage } = request.query

  if (!postId || !page || !perPage) {
    return handleBadRequest(response)
  }

  const apiRequest: GetPostPostCommentsApiRequestDto = {
    postId: String(postId),
    page: parseInt(String(page)),
    perPage: parseInt(String(perPage)),
  }

  const validationError = GetPostPostCommentsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const session = await getServerSession(request, response, authOptions)
  let userId: string | null = null

  if (session !== null) {
    userId = session.user.id
  }

  const useCase = container.resolve<GetPostPostComments>('getPostPostCommentsUseCase')

  const applicationRequest = GetPostPostCommentsRequestDtoTranslator.fromApiDto(apiRequest, userId)

  try {
    const comments = await useCase.get(applicationRequest)

    response.setHeader('Cache-Control', 'no-store')

    return response.status(200).json(comments)
  } catch (exception: unknown) {
    if (!(exception instanceof GetPostPostCommentsApplicationException)) {
      return handleServerError(response)
    }

    switch (exception.id) {
      case GetPostPostCommentsApplicationException.invalidPageValueId:
        return handleUnprocessableEntity(response, exception, POST_COMMENT_INVALID_PAGE)

      case GetPostPostCommentsApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception, POST_COMMENT_INVALID_PER_PAGE)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

async function handlePOST (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { postId } = request.query
  const comment = request.body.comment

  if (!postId) {
    return handleBadRequest(response)
  }

  let apiRequest: CreatePostCommentApiRequestDto

  try {
    apiRequest = CreatePostCommentRequestSanitizer.sanitize({
      comment: comment ?? '',
      userId: session.user.id,
      postId: String(postId),
    })
  } catch (exception: unknown) {
    console.error(exception)

    return handleServerError(response)
  }

  const validationError = CreatePostCommentApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const applicationRequest = CreatePostCommentRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<CreatePostComment>('createPostCommentUseCase')

  try {
    const comment = await useCase.create(applicationRequest)

    return response.status(201).json(comment)
  } catch (exception: unknown) {
    if (!(exception instanceof CreatePostCommentApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case CreatePostCommentApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_POST_NOT_FOUND)

      case CreatePostCommentApplicationException.userNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_USER_NOT_FOUND)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: POST_COMMENT_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', ['POST', 'GET'])
    .json({
      code: POST_COMMENT_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleAuthentication (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(401)
    .json({
      code: POST_COMMENT_AUTH_REQUIRED,
      message: 'User must be authenticated to access to resource',
    })
}

function handleValidationError (
  request: NextApiRequest,
  response: NextApiResponse,
  validationError: PostCommentApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: POST_COMMENT_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_COMMENT_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}

function handleNotFound (response: NextApiResponse, message: string, code: string) {
  return response.status(404)
    .json({
      code,
      message,
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
