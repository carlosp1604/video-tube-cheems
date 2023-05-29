import type { NextApiRequest, NextApiResponse } from 'next'
import {
  CreatePostCommentApiRequestValidator
} from '../../../../../modules/Posts/Infrastructure/Validators/CreatePostCommentApiRequestValidator'
import { bindings } from '../../../../../modules/Posts/Infrastructure/Bindings'
import {
  PostCommentApiRequestValidatorError
} from '../../../../../modules/Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'
import { CreatePostCommentRequestDtoTranslator } from '../../../../../modules/Posts/Infrastructure/CreatePostCommentRequestDtoTranslator'
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
import { GetPostPostCommentsApiRequestDto } from '../../../../../modules/Posts/Infrastructure/Dtos/GetPostPostCommentsApiRequestDto'
import { GetPostPostCommentsApiRequestValidator } from '../../../../../modules/Posts/Infrastructure/Validators/GetPostPostCommentsApiRequestValidator'
import { GetPostPostComments } from '../../../../../modules/Posts/Application/GetPostPostComments'
import { CreatePostChildCommentApiRequestDto } from '../../../../../modules/Posts/Infrastructure/Dtos/CreatePostChildCommentApiRequestDto'
import { CreatePostChildCommentRequestSanitizer } from '../../../../../modules/Posts/Infrastructure/Sanitizers/CreatePostChildCommentRequestSanitizer'
import { CreatePostChildCommentRequestDtoTranslator } from '../../../../../modules/Posts/Infrastructure/CreatePostChildCommentRequestDtoTranslator'
import { CreatePostChildComment } from '../../../../../modules/Posts/Application/CreatePostChildComment'
import { GetPostPostChildCommentsApiRequestDto } from '../../../../../modules/Posts/Infrastructure/Dtos/GetPostPostChildCommentsApiRequestDto'
import { GetPostPostChildCommentsApiRequestValidator } from '../../../../../modules/Posts/Infrastructure/Validators/GetPostPostChildCommentsApiRequestValidator'
import { GetPostPostChildComments } from '../../../../../modules/Posts/Application/GetPostPostChildComments'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    return handlePOST(request, response)
  }

  if (request.method === 'GET') {
    return handleGET(request, response)
  }

  return handleMethod(request, response)
}

async function handleGET (request: NextApiRequest, response: NextApiResponse) {
  const { postId, page, perPage, parentCommentId } = request.query

  if (!postId || !page || !perPage) {
    return handleBadRequest(response)
  }

  const handleGetPostComments = async () => {
    const apiRequest: GetPostPostCommentsApiRequestDto = {
      postId: postId.toString(),
      page: parseInt(page.toString()),
      perPage: parseInt(perPage.toString()),
    }

    const validationError = GetPostPostCommentsApiRequestValidator.validate(apiRequest)

    if (validationError) {
      return handleValidationError(request, response, validationError)
    }

    const useCase = bindings.get<GetPostPostComments>('GetPostPostComments')

    try {
      const comments = await useCase.get(
        apiRequest.postId,
        apiRequest.page,
        apiRequest.perPage
      )

      console.log(comments)

      return response
        .setHeader('Cache-Control', 'no-cache')
        .status(200).json(comments)
    } catch (exception: unknown) {
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

  const handleGetPostChildComments = async () => {
    const apiRequest: GetPostPostChildCommentsApiRequestDto = {
      postId: postId.toString(),
      page: parseInt(page.toString()),
      perPage: parseInt(perPage.toString()),
      parentCommentId: parentCommentId ? parentCommentId.toString() : '',
    }

    const validationError = GetPostPostChildCommentsApiRequestValidator.validate(apiRequest)

    if (validationError) {
      return handleValidationError(request, response, validationError)
    }

    const useCase = bindings.get<GetPostPostChildComments>('GetPostPostChildComments')

    try {
      const comments = await useCase.get(
        apiRequest.parentCommentId,
        apiRequest.page,
        apiRequest.perPage
      )

      console.log(comments)

      return response
        .setHeader('Cache-Control', 'no-cache')
        .status(200).json(comments)
    } catch (exception: unknown) {
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

  if (!parentCommentId) {
    return handleGetPostComments()
  } else {
    return handleGetPostChildComments()
  }
}

async function handlePOST (request: NextApiRequest, response: NextApiResponse) {
  const session = await UnstableGetServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { postId } = request.query

  if (!postId) {
    return handleBadRequest(response)
  }

  const handleCreateComment = async (apiRequest: CreatePostCommentApiRequestDto) => {
    try {
      apiRequest = JSON.parse(request.body) as CreatePostCommentApiRequestDto
      apiRequest = CreatePostCommentRequestSanitizer.sanitize({
        ...apiRequest,
        userId: session.user.id,
        postId: String(postId),
      })
    } catch (exception: unknown) {
      console.log(exception)

      return handleServerError(response)
    }

    const validationError = CreatePostCommentApiRequestValidator.validate(apiRequest)

    if (validationError) {
      return handleValidationError(request, response, validationError)
    }

    const applicationRequest = CreatePostCommentRequestDtoTranslator.fromApiDto(apiRequest)

    const useCase = bindings.get<CreatePostComment>('CreatePostComment')

    try {
      const comment = await useCase.create(applicationRequest)

      return response.status(201).json(comment)
    } catch (exception: unknown) {
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

  const handleCreateChildComment = async (apiRequest: CreatePostChildCommentApiRequestDto) => {
    try {
      apiRequest = JSON.parse(request.body) as CreatePostChildCommentApiRequestDto
      apiRequest = CreatePostChildCommentRequestSanitizer.sanitize({
        ...apiRequest,
        userId: session.user.id,
        postId: String(postId),
      })
    } catch (exception: unknown) {
      console.log(exception)

      return handleServerError(response)
    }

    const validationError = CreatePostCommentApiRequestValidator.validate(apiRequest)

    if (validationError) {
      return handleValidationError(request, response, validationError)
    }

    const applicationRequest = CreatePostChildCommentRequestDtoTranslator.fromApiDto(apiRequest)

    const useCase = bindings.get<CreatePostChildComment>('CreatePostChildComment')

    try {
      const childComment = await useCase.create(applicationRequest)

      return response.status(201).json(childComment)
    } catch (exception: unknown) {
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

  const body = JSON.parse(request.body)

  if (!body.parentCommentId) {
    return handleCreateComment(body)
  } else {
    return handleCreateChildComment(body)
  }
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: 'get-actor-bad-request',
      message: 'Post ID, page number and perPage parameters are needed',
    })
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', ['POST', 'GET'])
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
      code: 'create-post-comment-authentication-required',
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
      code: 'create-post-comment-validation-exception',
      message: 'Invalid request body',
      errors: validationError.exceptions,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'create-post-comment-server-error',
      message: 'Something went wrong while processing the request',
    })
}

function handleNotFound (response: NextApiResponse) {
  return response.status(404)
    .json({
      code: 'create-post-comment-not-found',
      message: 'Resource was not found',
    })
}

function handleConflict (response: NextApiResponse) {
  return response.status(409)
    .json({
      code: 'create-post-comment-cannot-add-comment',
      message: 'Cannot add comment to post',
    })
}
