import { NextApiRequest, NextApiResponse } from 'next'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import { container } from '~/awilix.container'
import {
  CreatePostReactionApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/CreatePostReactionApiRequestValidator'
import {
  CreatePostReactionRequestTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/CreatePostReactionRequestTranslator'
import { CreatePostReaction } from '~/modules/Posts/Application/CreatePostReaction/CreatePostReaction'
import {
  CreatePostReactionApplicationException
} from '~/modules/Posts/Application/CreatePostReaction/CreatePostReactionApplicationException'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import {
  POST_REACTION_ALREADY_EXISTS,
  POST_REACTION_AUTH_REQUIRED, POST_REACTION_BAD_REQUEST, POST_REACTION_METHOD,
  POST_REACTION_NOT_FOUND, POST_REACTION_POST_NOT_FOUND, POST_REACTION_SERVER_ERROR,
  POST_REACTION_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { CreatePostReactionApiRequest } from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostReactionApiRequest'
import {
  DeletePostReactionRequestTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/DeletePostReactionRequestTranslator'
import {
  DeletePostReactionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/DeletePostReactionApiRequestDto'
import {
  DeletePostReactionApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/DeletePostReactionApiRequestValidator'
import { DeletePostReaction } from '~/modules/Posts/Application/DeletePostReaction/DeletePostReaction'
import {
  DeletePostReactionApplicationException
} from '~/modules/Posts/Application/DeletePostReaction/DeletePostReactionApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST':
      return handlePost(request, response)

    case 'DELETE':
      return handleDelete(request, response)

    default:
      return handleMethod(request, response)
  }
}

async function handlePost (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthorizationRequired(response)
  }

  const { postId } = request.query

  if (!postId) {
    return handleBadRequest(response)
  }

  const createPostReactionApiRequest: CreatePostReactionApiRequest = {
    postId: String(postId),
    userId: session.user.id,
    reactionType: request.body.reactionType,
  }

  const validationError = CreatePostReactionApiRequestValidator.validate(createPostReactionApiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = CreatePostReactionRequestTranslator.fromApiDto(createPostReactionApiRequest)

  const useCase = container.resolve<CreatePostReaction>('createPostReactionUseCase')

  try {
    const reaction = await useCase.create(applicationRequest)

    return response.status(201).json(reaction)
  } catch (exception: unknown) {
    if (!(exception instanceof CreatePostReactionApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case CreatePostReactionApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message, POST_REACTION_POST_NOT_FOUND)

      case CreatePostReactionApplicationException.userAlreadyReactedId:
        return handleConflict(response, exception.message)

      default:
        return handleServerError(response)
    }
  }
}

async function handleDelete (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthorizationRequired(response)
  }

  const { postId } = request.query

  if (!postId) {
    return handleBadRequest(response)
  }

  const deletePostReactionApiRequest: DeletePostReactionApiRequestDto = {
    postId: String(postId),
    userId: session.user.id,
  }

  const validationError = DeletePostReactionApiRequestValidator.validate(deletePostReactionApiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = DeletePostReactionRequestTranslator.fromApiDto(deletePostReactionApiRequest)

  const useCase = container.resolve<DeletePostReaction>('deletePostReactionUseCase')

  try {
    await useCase.delete(applicationRequest)

    return response.status(204).end()
  } catch (exception: unknown) {
    if (!(exception instanceof DeletePostReactionApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case DeletePostReactionApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message, POST_REACTION_POST_NOT_FOUND)

      case DeletePostReactionApplicationException.userHasNotReactedId:
        return handleNotFound(response, exception.message, POST_REACTION_NOT_FOUND)

      default:
        return handleServerError(response)
    }
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'POST')
    .json({
      code: POST_REACTION_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: POST_REACTION_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleNotFound (
  response: NextApiResponse,
  message: string,
  code: string
) {
  return response.status(404)
    .json({
      code,
      message,
    })
}

function handleConflict (
  response: NextApiResponse,
  message: string
) {
  return response.status(409)
    .json({
      code: POST_REACTION_ALREADY_EXISTS,
      message,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_REACTION_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}

function handleAuthorizationRequired (response: NextApiResponse) {
  const baseUrl = container.resolve('baseUrl')

  response.setHeader('WWW-Authenticate', `Basic realm="${baseUrl}"`)

  return response
    .status(401)
    .json({
      code: POST_REACTION_AUTH_REQUIRED,
      message: 'User not authenticated',
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: POST_REACTION_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}
