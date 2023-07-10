import type { NextApiRequest, NextApiResponse } from 'next'
import {
  CreatePostCommentApplicationException
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationException'
import {
  GetPostPostChildCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Dtos/GetPostPostChildCommentsApiRequestDto'
import {
  GetPostPostChildCommentsApiRequestValidator
} from '~/modules/Posts/Infrastructure/Validators/GetPostPostChildCommentsApiRequestValidator'
import { GetPostPostChildComments } from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildComments'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Validators/PostCommentApiRequestValidatorError'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import {
  GetPostPostChildCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationException'
import { container } from '~/awilix.container'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const { page, perPage, commentId } = request.query

  if (!commentId || !page || !perPage) {
    return handleBadRequest(response)
  }

  const apiRequest: GetPostPostChildCommentsApiRequestDto = {
    page: parseInt(page.toString()),
    perPage: parseInt(perPage.toString()),
    parentCommentId: commentId ? commentId.toString() : '',
  }

  const validationError = GetPostPostChildCommentsApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(request, response, validationError)
  }

  const useCase = container.resolve<GetPostPostChildComments>('getPostPostChildCommentsUseCase')

  try {
    const comments = await useCase.get({
      parentCommentId: apiRequest.parentCommentId,
      page: apiRequest.page,
      perPage: apiRequest.perPage,
    })

    return response
      .status(200).json(comments)
  } catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof CreatePostCommentApplicationException)) {
      return handleServerError(response)
    }

    switch (exception.id) {
      case GetPostPostChildCommentsApplicationException.invalidPageValueId:
      case GetPostPostChildCommentsApplicationException.invalidPerPageValueId:
        return handleUnprocessableEntity(response, exception)

      default: {
        console.error(exception)

        return handleServerError(response)
      }
    }
  }
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: 'post-child-comment-bad-request',
      message: 'parentCommentId, page and perPage parameters are required',
    })
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', ['POST', 'GET'])
    .json({
      code: 'post-child-comment-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`,
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

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'post-child-comment-server-error',
      message: 'Something went wrong while processing the request',
    })
}

function handleUnprocessableEntity (
  response: NextApiResponse,
  exception: GetPostsApplicationException
) {
  return response.status(422)
    .json({
      code: 'post-child-comment-unprocessable-entity',
      message: exception.message,
    })
}
