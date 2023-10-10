import type { NextApiRequest, NextApiResponse } from 'next'
import {
  CreatePostCommentApplicationException
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationException'
import {
  GetPostPostChildCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostPostChildCommentsApiRequestDto'
import {
  GetPostPostChildCommentsApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/GetPostPostChildCommentsApiRequestValidator'
import { GetPostPostChildComments } from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildComments'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostCommentApiRequestValidatorError'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import {
  GetPostPostChildCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationException'
import { container } from '~/awilix.container'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import {
  CreatePostChildCommentRequestSanitizer
} from '~/modules/Posts/Infrastructure/Api/Sanitizers/CreatePostChildCommentRequestSanitizer'
import {
  CreatePostChildCommentApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/CreatePostChildCommentApiRequestValidator'
import {
  CreatePostChildCommentRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/CreatePostChildCommentRequestDtoTranslator'
import {
  CreatePostChildCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostChildCommentApiRequestDto'
import { CreatePostChildComment } from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildComment'
import {
  CreatePostChildCommentApplicationException
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationException'
import {
  POST_CHILD_COMMENT_AUTH_REQUIRED,
  POST_CHILD_COMMENT_BAD_REQUEST,
  POST_CHILD_COMMENT_INVALID_PAGE,
  POST_CHILD_COMMENT_INVALID_PER_PAGE, POST_CHILD_COMMENT_METHOD,
  POST_CHILD_COMMENT_PARENT_COMMENT_NOT_FOUND,
  POST_CHILD_COMMENT_POST_NOT_FOUND,
  POST_CHILD_COMMENT_SERVER_ERROR, POST_CHILD_COMMENT_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import {
  GetPostPostChildCommentsRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/GetPostPostChildCommentsRequestDtoTranslator'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'GET':
      return handleGet(request, response)

    case 'POST':
      return handlePost(request, response)

    default:
      return handleMethod(request, response)
  }
}

async function handleGet (request: NextApiRequest, response: NextApiResponse) {
  const { page, perPage, commentId } = request.query

  if (!commentId || !page || !perPage) {
    return handleBadRequest(response)
  }

  const apiRequest: GetPostPostChildCommentsApiRequestDto = {
    page: parseInt(page.toString()),
    perPage: parseInt(perPage.toString()),
    parentCommentId: String(commentId),
  }

  const validationError = GetPostPostChildCommentsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const session = await getServerSession(request, response, authOptions)
  let userId: string | null = null

  if (session !== null) {
    userId = session.user.id
  }

  const useCase = container.resolve<GetPostPostChildComments>('getPostPostChildCommentsUseCase')

  const applicationRequest = GetPostPostChildCommentsRequestDtoTranslator.fromApiDto(apiRequest, userId)

  try {
    const comments = await useCase.get(applicationRequest)

    return response.status(200).json(comments)
  } catch (exception: unknown) {
    if (!(exception instanceof CreatePostCommentApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case GetPostPostChildCommentsApplicationException.invalidPageValueId:
        return handleUnprocessableEntity(response, exception, POST_CHILD_COMMENT_INVALID_PAGE)
      case GetPostPostChildCommentsApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception, POST_CHILD_COMMENT_INVALID_PER_PAGE)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

async function handlePost (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { commentId, postId } = request.query

  const comment = request.body.comment

  if (!commentId || !comment || !postId) {
    return handleBadRequest(response)
  }

  let apiRequest: CreatePostChildCommentApiRequestDto

  try {
    apiRequest = CreatePostChildCommentRequestSanitizer.sanitize({
      parentCommentId: String(commentId),
      comment,
      userId: session.user.id,
      postId: String(postId),
    })
  } catch (exception: unknown) {
    console.error(exception)

    return handleServerError(response)
  }

  const validationError = CreatePostChildCommentApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const applicationRequest = CreatePostChildCommentRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<CreatePostChildComment>('createPostChildCommentUseCase')

  try {
    const childComment = await useCase.create(applicationRequest)

    return response.status(201).json(childComment)
  } catch (exception: unknown) {
    if (!(exception instanceof CreatePostChildCommentApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      // NOTE: If user is not found we assume is a server error
      case CreatePostChildCommentApplicationException.postNotFoundId:
        return handleNotFound(response, exception, POST_CHILD_COMMENT_POST_NOT_FOUND)
      case CreatePostChildCommentApplicationException.parentCommentNotFoundId:
        return handleNotFound(response, exception, POST_CHILD_COMMENT_PARENT_COMMENT_NOT_FOUND)

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
      code: POST_CHILD_COMMENT_BAD_REQUEST,
      message: 'commentId, postId and comment parameters are required',
    })
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', ['POST', 'GET'])
    .json({
      code: POST_CHILD_COMMENT_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  request: NextApiRequest,
  response: NextApiResponse,
  validationError: PostCommentApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: POST_CHILD_COMMENT_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_CHILD_COMMENT_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
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

function handleNotFound (
  response: NextApiResponse,
  exception: CreatePostChildCommentApplicationException,
  code: string
) {
  return response.status(404)
    .json({
      code,
      message: exception.message,
    })
}

function handleAuthentication (request: NextApiRequest, response: NextApiResponse) {
  const baseUrl = container.resolve<string>('baseUrl')

  response.setHeader(
    'WWW-Authenticate',
    `Basic realm="${baseUrl}"`
  )

  return response
    .status(401)
    .json({
      code: POST_CHILD_COMMENT_AUTH_REQUIRED,
      message: 'User must be authenticated to access to resource',
    })
}
