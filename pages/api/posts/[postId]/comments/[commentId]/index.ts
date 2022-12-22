import { NextApiRequest, NextApiResponse } from 'next'
import {
  UpdatePostCommentApiRequestDto
} from '../../../../../../modules/Posts/Infrastructure/Dtos/UpdatePostCommentApiRequestDto'
import { unstable_getServerSession as UnstableGetServerSession } from 'next-auth/next'
import { authOptions } from '../../../../auth/[...nextauth]'
import {
  UpdatePostCommentRequestSanitizer
} from '../../../../../../modules/Posts/Infrastructure/Sanitizers/UpdatePostCommentRequestSanitizer'
import {
  UpdatePostCommentApiRequestValidator
} from '../../../../../../modules/Posts/Infrastructure/Validators/UpdatePostCommentApiRequestValidator'
import {
  UpdatePostRequestDtoTranslator
} from '../../../../../../modules/Posts/Infrastructure/UpdatePostRequestDtoTranslator'
import { bindings } from '../../../../../../modules/Posts/Infrastructure/Bindings'
import { UpdatePostComment } from '../../../../../../modules/Posts/Application/UpdatePostComment'
import {
  UpdatePostCommentApplicationException
} from '../../../../../../modules/Posts/Application/UpdatePostCommentApplicationException'
import {
  PostCommentApiRequestValidatorError
} from '../../../../../../modules/Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'PATCH') {
    return handleMethod(request, response)
  }

  const session = await UnstableGetServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { postId, commentId } = request.query

  let apiRequest: UpdatePostCommentApiRequestDto
  try {
    apiRequest = JSON.parse(request.body) as UpdatePostCommentApiRequestDto
    apiRequest = UpdatePostCommentRequestSanitizer.sanitize({
      ...apiRequest,
      userId: session.user.id,
      postCommentId: String(commentId),
      postId: String(postId)
    })
  }
  catch (exception: unknown) {
    return handleServerError(response)
  }

  const validationError = UpdatePostCommentApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const applicationRequest = UpdatePostRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = bindings.get<UpdatePostComment>('UpdatePostComment')

  try {
    await useCase.update(applicationRequest)
  }
  catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof UpdatePostCommentApplicationException)) {
      return handleServerError(response)
    }

    switch (exception.id) {
      case UpdatePostCommentApplicationException.postNotFoundId:
        return handleNotFound(response)

      case UpdatePostCommentApplicationException.cannotUpdateCommentId:
        return handleConflict(response)

      default:
        return handleServerError(response)
    }
  }

  return response.status(200).json({})
}

function handleMethod(request: NextApiRequest,response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'PATCH')
    .json({
      code: 'update-post-comment-method-not-allowed',
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
      code: 'update-post-comment-authentication-required',
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
      code: 'update-post-comment-validation-exception',
      message: 'Invalid request body',
      errors: validationError.exceptions
    })
}

function handleServerError(response: NextApiResponse,) {
  return response.status(500)
    .json({
      code: 'update-post-comment-server-error',
      message: 'Something went wrong while processing the request'
    })
}

function handleNotFound(response: NextApiResponse,) {
  return response.status(404)
    .json({
      code: 'update-post-comment-not-found',
      message: 'Resource was not found'
    })
}

function handleConflict(response: NextApiResponse,) {
  return response.status(409)
    .json({
      code: 'update-post-comment-cannot-add-comment',
      message: 'Cannot update comment'
    })
}
