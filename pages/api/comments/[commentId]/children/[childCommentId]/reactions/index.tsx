import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostCommentApiRequestValidatorError'
import { container } from '~/awilix.container'
import {
  POST_COMMENT_REACTION_AUTH_REQUIRED,
  POST_COMMENT_REACTION_BAD_REQUEST,
  POST_COMMENT_REACTION_METHOD, POST_COMMENT_REACTION_NOT_FOUND, POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND,
  POST_COMMENT_REACTION_SERVER_ERROR, POST_COMMENT_REACTION_USER_ALREADY_REACTED, POST_COMMENT_REACTION_USER_NOT_FOUND,
  POST_COMMENT_REACTION_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import {
  CreatePostCommentReactionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentReactionApiRequestDto'
import {
  CreatePostCommentReaction
} from '~/modules/Posts/Application/CreatePostCommentReaction/CreatePostCommentReaction'
import {
  CreatePostCommentReactionRequestTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/CreatePostCommentReactionRequestTranslator'
import {
  CreatePostCommentReactionApplicationException
} from '~/modules/Posts/Application/CreatePostCommentReaction/CreatePostCommentReactionApplicationException'
import {
  CreatePostCommentReactionApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/CreatePostCommentReactionApiRequestValidator'
import {
  DeletePostCommentReactionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/DeletePostCommentReactionApiRequestDto'
import {
  DeletePostCommentReactionApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/DeletePostCommentReactionApiRequestValidator'
import {
  DeletePostCommentReactionRequestTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/DeletePostCommentReactionRequestTranslator'
import {
  DeletePostCommentReaction
} from '~/modules/Posts/Application/DeletePostCommentReaction/DeletePostCommentReaction'
import {
  DeletePostCommentReactionApplicationException
} from '~/modules/Posts/Application/DeletePostCommentReaction/DeletePostCommentReactionApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST':
      return handlePostMethod(request, response)

    case 'DELETE':
      return handleDeleteMethod(request, response)

    default:
      return handleMethod(request, response)
  }
}

async function handlePostMethod (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(response)
  }

  const { commentId, childCommentId } = request.query

  if (!commentId || !childCommentId) {
    return handleBadRequest(response)
  }

  const apiRequest: CreatePostCommentReactionApiRequestDto = {
    // Post comment does not have a parent comment
    parentCommentId: String(commentId),
    userId: session.user.id,
    postCommentId: String(childCommentId),
  }

  const validationError = CreatePostCommentReactionApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = CreatePostCommentReactionRequestTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<CreatePostCommentReaction>('createPostCommentReactionUseCase')

  try {
    const reaction = await useCase.create(applicationRequest)

    return response.status(201).json(reaction)
  } catch (exception: unknown) {
    if (!(exception instanceof CreatePostCommentReactionApplicationException)) {
      console.error(exception)

      throw exception
    }

    switch (exception.id) {
      case CreatePostCommentReactionApplicationException.postCommentNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND)

      case CreatePostCommentReactionApplicationException.userAlreadyReactedId:
        return handleConflict(response, exception.message, POST_COMMENT_REACTION_USER_ALREADY_REACTED)

      case CreatePostCommentReactionApplicationException.userNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_REACTION_USER_NOT_FOUND)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

async function handleDeleteMethod (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(response)
  }

  const { commentId, childCommentId } = request.query

  if (!commentId || !childCommentId) {
    return handleBadRequest(response)
  }

  const apiRequest: DeletePostCommentReactionApiRequestDto = {
    // Post comment does not have a parent comment
    parentCommentId: String(commentId),
    postCommentId: String(childCommentId),
    userId: session.user.id,
  }

  const validationError = DeletePostCommentReactionApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = DeletePostCommentReactionRequestTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<DeletePostCommentReaction>('deletePostCommentReactionUseCase')

  try {
    await useCase.delete(applicationRequest)

    return response.status(204).end()
  } catch (exception: unknown) {
    if (!(exception instanceof DeletePostCommentReactionApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case DeletePostCommentReactionApplicationException.postCommentNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND)

      case DeletePostCommentReactionApplicationException.userHasNotReactedId:
        return handleNotFound(response, exception.message, POST_COMMENT_REACTION_NOT_FOUND)

      case DeletePostCommentReactionApplicationException.userNotFoundId:
        return handleNotFound(response, exception.message, POST_COMMENT_REACTION_USER_NOT_FOUND)

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
    .setHeader('Allow', ['POST', 'DELETE'])
    .json({
      code: POST_COMMENT_REACTION_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleAuthentication (response: NextApiResponse) {
  return response
    .status(401)
    .json({
      code: POST_COMMENT_REACTION_AUTH_REQUIRED,
      message: 'User must be authenticated to access to resource',
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostCommentApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: POST_COMMENT_REACTION_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_COMMENT_REACTION_SERVER_ERROR,
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
      code: POST_COMMENT_REACTION_BAD_REQUEST,
      message: 'commentId and childCommentId parameters are required',
    })
}
