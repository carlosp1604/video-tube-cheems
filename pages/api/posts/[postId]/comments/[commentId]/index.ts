import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession as UnstableGetServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { DeletePostCommentApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/DeletePostCommentApiRequestDto'
import {
  DeletePostCommentApiRequestValidator
} from '~/modules/Posts/Infrastructure/Validators/DeletePostCommentApiRequestValidator'
import { DeletePostRequestDtoTranslator } from '~/modules/Posts/Infrastructure/DeletePostRequestDtoTranslator'
import { DeletePostComment } from '~/modules/Posts/Application/DeletePostComment'
import { bindings } from '~/modules/Posts/Infrastructure/Bindings'
import {
  DeletePostCommentApplicationException
} from '~/modules/Posts/Application/DeletePostCommentApplicationException'
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
  const session = await UnstableGetServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { postId, commentId } = request.query

  let apiRequest: DeletePostCommentApiRequestDto

  try {
    apiRequest = request.body as DeletePostCommentApiRequestDto
    apiRequest = {
      ...apiRequest,
      userId: session.user.id,
      postCommentId: String(commentId),
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

  const useCase = bindings.get<DeletePostComment>('DeletePostComment')

  try {
    await useCase.delete(applicationRequest)
  } catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof DeletePostCommentApplicationException)) {
      return handleServerError(response, exception)
    }

    switch (exception.id) {
      case DeletePostCommentApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message)

      case DeletePostCommentApplicationException.cannotDeleteCommentId:
        return handleConflict(response, exception.message)

      default:
        return handleServerError(response, exception)
    }
  }

  return response.status(200).json({})
}

async function handlePatchMethod (request: NextApiRequest, response: NextApiResponse) {
  const session = await UnstableGetServerSession(request, response, authOptions)

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
    return handleServerError(response, exception)
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
    console.error(exception)
    if (!(exception instanceof UpdatePostCommentApplicationException)) {
      return handleServerError(response, exception)
    }

    switch (exception.id) {
      case UpdatePostCommentApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message)

      case UpdatePostCommentApplicationException.cannotUpdateCommentId:
        return handleConflict(response, exception.message)

      default:
        return handleServerError(response, exception)
    }
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'PATCH, DELETE')
    .json({
      code: 'post-comment-method-not-allowed',
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
      code: 'post-comment-authentication-required',
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
      code: 'post-comment-validation-exception',
      message: 'Invalid request body',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse, exception: unknown) {
  console.log(exception)

  return response.status(500)
    .json({
      code: 'post-comment-server-error',
      message: 'Something went wrong while processing the request',
    })
}

function handleNotFound (response: NextApiResponse, message: string) {
  return response.status(404)
    .json({
      code: 'post-comment-resource-not-found',
      message,
    })
}

function handleConflict (response: NextApiResponse, message: string) {
  return response.status(409)
    .json({
      code: 'post-comment-resource-conflict',
      message,
    })
}
