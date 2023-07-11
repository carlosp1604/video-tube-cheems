import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { DeletePostCommentApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/DeletePostCommentApiRequestDto'
import {
  DeletePostCommentApiRequestValidator
} from '~/modules/Posts/Infrastructure/Validators/DeletePostCommentApiRequestValidator'
import { DeletePostRequestDtoTranslator } from '~/modules/Posts/Infrastructure/DeletePostRequestDtoTranslator'
import { DeletePostComment } from '~/modules/Posts/Application/DeletePostComment/DeletePostComment'
import { bindings } from '~/modules/Posts/Infrastructure/Bindings'
import {
  DeletePostCommentApplicationException
} from '~/modules/Posts/Application/DeletePostComment/DeletePostCommentApplicationException'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'
import { container } from '~/awilix.container'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'PATCH':
      return handlePatchMethod(request, response)

    case 'DELETE':
      return handleDeleteMethod(request, response)

    default:
      return handleMethod(request, response)
  }
}

async function handleDeleteMethod (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { postId, commentId, childCommentId } = request.query

  if (!postId || !commentId || !childCommentId) {
    return handleBadRequest(response)
  }

  let apiRequest: DeletePostCommentApiRequestDto

  try {
    apiRequest = {
      parentCommentId: String(commentId),
      userId: session.user.id,
      postCommentId: String(childCommentId),
      postId: String(postId),
    }
  } catch (exception: unknown) {
    return handleServerError(response, exception)
  }

  const validationError = DeletePostCommentApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const applicationRequest = DeletePostRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<DeletePostComment>('deletePostCommentUseCase')

  try {
    await useCase.delete(applicationRequest)
  } catch (exception: unknown) {
    if (!(exception instanceof DeletePostCommentApplicationException)) {
      console.error(exception)

      return handleServerError(response, exception)
    }

    switch (exception.id) {
      case DeletePostCommentApplicationException.postNotFoundId: {
        return handleNotFound(response, exception.message, 'post-child-comment-post-not-found')
      }

      case DeletePostCommentApplicationException.parentCommentNotFoundId: {
        return handleNotFound(response, exception.message, 'post-child-comment-parent-comment-not-found')
      }

      case DeletePostCommentApplicationException.postCommentNotFoundId: {
        return handleNotFound(response, exception.message, 'post-child-comment-post-comment-not-found')
      }

      case DeletePostCommentApplicationException.userCannotDeleteCommentId: {
        return handleForbidden(response)
      }

      case DeletePostCommentApplicationException.cannotDeleteCommentId:
        return handleConflict(response, exception.message)

      default: {
        console.error(exception)

        return handleServerError(response, exception)
      }
    }
  }

  return response.status(200).json({})
}

async function handlePatchMethod (request: NextApiRequest, response: NextApiResponse) {
  throw Error('Not implemented')
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'PATCH, DELETE')
    .json({
      code: 'post-child-comment-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`,
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

function handleServerError (response: NextApiResponse, exception: unknown) {
  console.log(exception)

  return response.status(500)
    .json({
      code: 'post-child-comment-server-error',
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

function handleConflict (response: NextApiResponse, message: string) {
  return response.status(409)
    .json({
      code: 'post-child-comment-resource-conflict',
      message,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: 'post-child-comment-bad-request',
      message: 'postId, commentId and childCommentId parameters are required',
    })
}

function handleForbidden (response: NextApiResponse) {
  return response
    .status(403)
    .json({
      code: 'post-child-comment-forbidden',
      message: 'User does not have access to the resource',
    })
}
