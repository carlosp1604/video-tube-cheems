import type { NextApiRequest, NextApiResponse } from 'next'
import {
  CreatePostCommentApiRequestValidator
} from '../../../../../modules/Posts/Infrastructure/Validators/CreatePostCommentApiRequestValidator'
import { bindings } from '../../../../../modules/Posts/Infrastructure/Bindings'
import {
  PostCommentApiRequestValidatorError
} from '../../../../../modules/Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'
import { CreatePostRequestDtoTranslator } from '../../../../../modules/Posts/Infrastructure/CreatePostRequestDtoTranslator'
import { CreatePostComment } from '../../../../../modules/Posts/Application/CreatePostComment'
import {
  CreatePostCommentApplicationException
} from '../../../../../modules/Posts/Application/CreatePostCommentApplicationException'
import {
  CreatePostCommentApiRequestDto
} from '../../../../../modules/Posts/Infrastructure/Dtos/CreatePostCommentApiRequestDto'
import { unstable_getServerSession as UnstableGetServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'
import {
  CreatePostCommentRequestSanitizer
} from '../../../../../modules/Posts/Infrastructure/Sanitizers/CreatePostCommentRequestSanitizer'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(request, response)
  }

  const session = await UnstableGetServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { postId } = request.query

  let apiRequest: CreatePostCommentApiRequestDto
  try {
    apiRequest = request.body as CreatePostCommentApiRequestDto
    apiRequest = CreatePostCommentRequestSanitizer.sanitize({
      ...apiRequest,
      userId: session.user.id,
      postId: String(postId)
    })
  }
  catch (exception: unknown) {
    console.log(exception)
    return handleServerError(response)
  }

  const validationError = CreatePostCommentApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const applicationRequest = CreatePostRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = bindings.get<CreatePostComment>('CreatePostComment')

  try {
    const comment = await useCase.create(applicationRequest)
    return response.status(201).json(comment)

  }
  catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof CreatePostCommentApplicationException)) {
      return handleServerError(response)
    }

    switch (exception.id) {
      case CreatePostCommentApplicationException.postNotFoundId:
        return handleNotFound(response)

      case CreatePostCommentApplicationException.cannotAddCommentId:
        return handleConflict(response)

      default:
        return handleServerError(response)
    }
  }
}

function handleMethod(request: NextApiRequest,response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'POST')
    .json({
      code: 'create-post-comment-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`
    })
}

function handleAuthentication(request: NextApiRequest, response: NextApiResponse) {
  const baseUrl = bindings.get<string>('BaseUrl')

  response.setHeader(
    'WWW-Authenticate',
    `Basic realm="${baseUrl}"`
  )

  return response
    .status(401)
    .json({
      code: 'create-post-comment-authentication-required',
      message: 'User must be authenticated to access to resource',
    })
}

function handleValidationError(
  request: NextApiRequest,
  response: NextApiResponse,
  validationError: PostCommentApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: 'create-post-comment-validation-exception',
      message: 'Invalid request body',
      errors: validationError.exceptions
    })
}

function handleServerError(response: NextApiResponse,) {
  return response.status(500)
    .json({
      code: 'create-post-comment-server-error',
      message: 'Something went wrong while processing the request'
    })
}

function handleNotFound(response: NextApiResponse,) {
  return response.status(404)
    .json({
      code: 'create-post-comment-not-found',
      message: 'Resource was not found'
    })
}

function handleConflict(response: NextApiResponse,) {
  return response.status(409)
    .json({
      code: 'create-post-comment-cannot-add-comment',
      message: 'Cannot add comment to post'
    })
}
