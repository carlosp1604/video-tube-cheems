import type { NextApiRequest, NextApiResponse } from 'next'
import {
  CreatePostCommentApplicationException
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationException'
import {
  GetPostPostChildCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Dtos/GetPostPostChildCommentsApiRequestDto'
import {
  GetPostPostChildCommentsApiRequestValidator
} from '~/modules/Posts/Infrastructure/Validators/GetPostPostChildCommentsApiRequestValidator'
import { GetPostPostChildComments } from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildComments'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import {
  GetPostPostChildCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationException'
import { container } from '~/awilix.container'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { bindings } from '~/modules/Posts/Infrastructure/Bindings'
import {
  CreatePostChildCommentRequestSanitizer
} from '~/modules/Posts/Infrastructure/Sanitizers/CreatePostChildCommentRequestSanitizer'
import {
  CreatePostChildCommentApiRequestValidator
} from '~/modules/Posts/Infrastructure/Validators/CreatePostChildCommentApiRequestValidator'
import {
  CreatePostChildCommentRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/CreatePostChildCommentRequestDtoTranslator'
import {
  CreatePostChildCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Dtos/CreatePostChildCommentApiRequestDto'
import { CreatePostChildComment } from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildComment'
import {
  CreatePostChildCommentApplicationException
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationException'

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
    parentCommentId: commentId ? commentId.toString() : '',
  }

  const validationError = GetPostPostChildCommentsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const useCase = container.resolve<GetPostPostChildComments>('getPostPostChildCommentsUseCase')

  try {
    const comments = await useCase.get({
      parentCommentId: apiRequest.parentCommentId,
      page: apiRequest.page,
      perPage: apiRequest.perPage,
    })

    return response
      .status(200).json(comments)
  } catch (exception: unknown) {
    if (!(exception instanceof CreatePostCommentApplicationException)) {
      return handleServerError(response)
    }

    switch (exception.id) {
      case GetPostPostChildCommentsApplicationException.invalidPageValueId:
      case GetPostPostChildCommentsApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception)

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
      case CreatePostChildCommentApplicationException.parentCommentNotFoundId:
        return handleNotFound(response, exception)

      case CreatePostChildCommentApplicationException.cannotAddCommentId:
        return handleConflict(response)

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
      code: 'post-child-comment-bad-request',
      message: 'parentCommentId, page and perPage parameters are required',
    })
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', ['POST', 'GET'])
    .json({
      code: 'post-child-comment-method-not-allowed',
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
      code: 'post-child-comment-validation-exception',
      message: 'Invalid request body',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'post-child-comment-server-error',
      message: 'Something went wrong while processing the request',
    })
}

function handleUnprocessableEntity (
  response: NextApiResponse,
  exception: GetPostsApplicationException
) {
  return response.status(422)
    .json({
      code: 'post-child-comment-unprocessable-entity',
      message: exception.message,
    })
}

function handleNotFound (response: NextApiResponse, exception: CreatePostChildCommentApplicationException) {
  return response.status(404)
    .json({
      code: 'post-child-comment-resource-not-found',
      message: exception.message,
    })
}

function handleConflict (response: NextApiResponse) {
  return response.status(409)
    .json({
      code: 'post-child-comment-cannot-add-comment',
      message: 'Cannot add comment to post',
    })
}

function handleAuthentication (request: NextApiRequest, response: NextApiResponse) {
  const baseUrl = bindings.get<string>('BaseUrl')

  response.setHeader(
    'WWW-Authenticate',
    `Basic realm="${baseUrl}"`
  )

  return response
    .status(401)
    .json({
      code: 'post-child-comment-authentication-required',
      message: 'User must be authenticated to access to resource',
    })
}
