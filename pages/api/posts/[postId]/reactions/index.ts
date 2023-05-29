import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'
import { container } from '~/awailix.container'
import { AddPostViewApiRequestValidator }
  from '~/modules/Posts/Infrastructure/Validators/AddPostViewApiRequestValidator'
import { AddPostViewRequestTranslator } from '~/modules/Posts/Infrastructure/AddPostViewRequestTranslator'
import { AddPostView } from '~/modules/Posts/Application/AddPostView/AddPostView'
import { AddPostViewApplicationException } from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationException'
import {
  AddPostReactionApiRequestValidator
} from '~/modules/Posts/Infrastructure/Validators/AddPostReactionApiRequestValidator'
import { AddPostReactionRequestTranslator } from '~/modules/Posts/Infrastructure/AddPostReactionRequestTranslator'
import { CreatePostReaction } from '~/modules/Posts/Application/CreatePostReaction/CreatePostReaction'
import {
  CreatePostReactionApplicationException
} from '~/modules/Posts/Application/CreatePostReaction/CreatePostReactionApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST':
      return handlePost(request, response)

      // case 'DELETE':

    default:
      return handleMethod(request, response)
  }
}

async function handlePost (request: NextApiRequest, response: NextApiResponse) {
  const validationError = AddPostReactionApiRequestValidator.validate(request.body)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = AddPostReactionRequestTranslator.fromApiDto(request.body)

  const useCase = container.resolve<CreatePostReaction>('addPostReaction')

  try {
    const reaction = await useCase.create(applicationRequest)

    return response.status(200).json(reaction)
  } catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof CreatePostReactionApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case CreatePostReactionApplicationException.postNotFoundId:
      case CreatePostReactionApplicationException.userNotFoundId:
        return handleNotFound(response, exception)

      case CreatePostReactionApplicationException.userAlreadyReactedId:
        return handleConflict(response, exception)

      default:
        return handleServerError(response)
    }
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'POST, DELETE')
    .json({
      code: 'post-reactions-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: 'post-reactions-bad-request',
      message: 'Invalid request body',
      errors: validationError.exceptions,
    })
}

function handleNotFound (
  response: NextApiResponse,
  exception: GetPostsApplicationException
) {
  return response.status(404)
    .json({
      code: 'post-reactions-not-found',
      message: exception.message,
    })
}

function handleConflict (
  response: NextApiResponse,
  exception: GetPostsApplicationException
) {
  return response.status(409)
    .json({
      code: 'post-reactions-not-found',
      message: exception.message,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'post-reactions-server-error',
      message: 'Something went wrong while processing the request',
    })
}
