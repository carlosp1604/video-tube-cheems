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
import { UpdatePostCommentApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/UpdatePostCommentApiRequestDto'
import {
  UpdatePostCommentRequestSanitizer
} from '~/modules/Posts/Infrastructure/Sanitizers/UpdatePostCommentRequestSanitizer'
import {
  UpdatePostCommentApiRequestValidator
} from '~/modules/Posts/Infrastructure/Validators/UpdatePostCommentApiRequestValidator'
import { UpdatePostRequestDtoTranslator } from '~/modules/Posts/Infrastructure/UpdatePostRequestDtoTranslator'
import { UpdatePostComment } from '~/modules/Posts/Application/UpdatePostComment'
import {
  UpdatePostCommentApplicationException
} from '~/modules/Posts/Application/UpdatePostCommentApplicationException'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'
import { container } from '~/awilix.container'
import {
  POST_COMMENT_AUTH_REQUIRED,
  POST_COMMENT_BAD_REQUEST,
  POST_COMMENT_CANNOT_DELETE_COMMENT,
  POST_COMMENT_CANNOT_UPDATE_COMMENT,
  POST_COMMENT_COMMENT_NOT_FOUND,
  POST_COMMENT_FORBIDDEN,
  POST_COMMENT_METHOD,
  POST_COMMENT_POST_NOT_FOUND,
  POST_COMMENT_SERVER_ERROR,
  POST_COMMENT_VALIDATION
} from '~/modules/Posts/Infrastructure/PostApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
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

  const { postId, commentId } = request.query

  if (!postId || !commentId) {
    return handleBadRequest(response)
  }

  let apiRequest: DeletePostCommentApiRequestDto

  try {
    apiRequest = {
      parentCommentId: null,
      userId: session.user.id,
      postCommentId: String(commentId),
      postId: String(postId),
    }
  } catch (exception: unknown) {
    return handleServerError(response)
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

      return handleServerError(response)
    }

    switch (exception.id) {
      case DeletePostCommentApplicationException.postNotFoundId: {
        return handleNotFound(response, exception.message, POST_COMMENT_POST_NOT_FOUND)
      }

      case DeletePostCommentApplicationException.postCommentNotFoundId: {
        return handleNotFound(response, exception.message, POST_COMMENT_COMMENT_NOT_FOUND)
      }

      case DeletePostCommentApplicationException.userCannotDeleteCommentId: {
        return handleForbidden(response)
      }

      case DeletePostCommentApplicationException.cannotDeleteCommentId: {
        return handleConflict(response, exception.message, POST_COMMENT_CANNOT_DELETE_COMMENT)
      }

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }

  return response.status(200).json({})
}

// TODO: Fixme before post comment update is supported
async function handlePatchMethod (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { postId, commentId } = request.query

  let apiRequest: UpdatePostCommentApiRequestDto

  try {
    apiRequest = request.body as UpdatePostCommentApiRequestDto
    apiRequest = UpdatePostCommentRequestSanitizer.sanitize({
      ...apiRequest,
      userId: session.user.id,
      postCommentId: String(commentId),
      postId: String(postId),
    })
  } catch (exception: unknown) {
    return handleServerError(response)
  }
  const validationError = UpdatePostCommentApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const applicationRequest = UpdatePostRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = bindings.get<UpdatePostComment>('UpdatePostComment')

  try {
    const comment = await useCase.update(applicationRequest)

    return response.status(200).json(comment)
  } catch (exception: unknown) {
    if (!(exception instanceof UpdatePostCommentApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case UpdatePostCommentApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_POST_NOT_FOUND)

      case UpdatePostCommentApplicationException.cannotUpdateCommentId:
        return handleConflict(response, exception.message, POST_COMMENT_CANNOT_UPDATE_COMMENT)

      default:
        return handleServerError(response)
    }
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'DELETE')
    .json({
      code: POST_COMMENT_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
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

function handleConflict (response: NextApiResponse, message: string, code: string) {
  return response.status(409)
    .json({
      code,
      message,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: POST_COMMENT_BAD_REQUEST,
      message: 'postId and commentId parameters are required',
    })
}

function handleForbidden (response: NextApiResponse) {
  return response
    .status(403)
    .json({
      code: POST_COMMENT_FORBIDDEN,
      message: 'User does not have access to the resource',
    })
}
