import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'
import { container } from '~/awilix.container'
import {
  AddPostReactionApiRequestValidator
} from '~/modules/Posts/Infrastructure/Validators/AddPostReactionApiRequestValidator'
import { AddPostReactionRequestTranslator } from '~/modules/Posts/Infrastructure/AddPostReactionRequestTranslator'
import { CreatePostReaction } from '~/modules/Posts/Application/CreatePostReaction/CreatePostReaction'
import {
  CreatePostReactionApplicationException
} from '~/modules/Posts/Application/CreatePostReaction/CreatePostReactionApplicationException'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { USER_AUTH_REQUIRED } from '~/modules/Auth/Infrastructure/AuthApiExceptionCodes'
import {
  POST_BAD_REQUEST, POST_METHOD,
  POST_POST_NOT_FOUND, POST_REACTION_ALREADY_EXISTS,
  POST_SERVER_ERROR, POST_VALIDATION
} from '~/modules/Posts/Infrastructure/PostApiExceptionCodes'
import { CreatePostReactionApiRequest } from '~/modules/Posts/Infrastructure/Dtos/CreatePostReactionApiRequest'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST':
      return handlePost(request, response)

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

  const validationError = AddPostReactionApiRequestValidator.validate(createPostReactionApiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = AddPostReactionRequestTranslator.fromApiDto(createPostReactionApiRequest)

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
        return handleNotFound(response, exception)

      case CreatePostReactionApplicationException.userAlreadyReactedId:
        return handleConflict(response, exception.message)

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
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleNotFound (
  response: NextApiResponse,
  exception: GetPostsApplicationException
) {
  return response.status(404)
    .json({
      code: POST_POST_NOT_FOUND,
      message: exception.message,
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
      code: POST_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}

function handleAuthorizationRequired (response: NextApiResponse) {
  const baseUrl = container.resolve('baseUrl')

  response.setHeader('WWW-Authenticate', `Basic realm="${baseUrl}"`)

  return response
    .status(401)
    .json({
      code: USER_AUTH_REQUIRED,
      message: 'User not authenticated',
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: POST_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}
