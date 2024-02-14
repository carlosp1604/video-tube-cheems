import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import { container } from '~/awilix.container'
import { AddPostViewApiRequestValidator }
  from '~/modules/Posts/Infrastructure/Api/Validators/AddPostViewApiRequestValidator'
import { AddPostViewRequestTranslator } from '~/modules/Posts/Infrastructure/AddPostViewRequestTranslator'
import { AddPostView } from '~/modules/Posts/Application/AddPostView/AddPostView'
import {
  AddPostViewApplicationException
} from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationException'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { AddPostViewApiRequest } from '~/modules/Posts/Infrastructure/Api/Requests/AddPostViewApiRequest'
import {
  POST_BAD_REQUEST, POST_METHOD,
  POST_POST_NOT_FOUND,
  POST_SERVER_ERROR, POST_USER_NOT_FOUND, POST_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(request, response)
  }

  const session = await getServerSession(request, response, authOptions)

  const { postId } = request.query

  if (!postId) {
    return handleBadRequest(response)
  }

  const apiRequest: AddPostViewApiRequest = {
    userId: session !== null ? session.user.id : null,
    postId: String(postId),
  }

  const validationError = AddPostViewApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = AddPostViewRequestTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<AddPostView>('addPostViewUseCase')

  try {
    const posts = await useCase.add(applicationRequest)

    return response.status(200).json(posts)
  } catch (exception: unknown) {
    if (!(exception instanceof AddPostViewApplicationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case AddPostViewApplicationException.postNotFoundId:
        return handleNotFound(response, POST_POST_NOT_FOUND, exception)

      case AddPostViewApplicationException.userNotFoundId:
        return handleNotFound(response, POST_USER_NOT_FOUND, exception)

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

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: POST_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}

function handleNotFound (
  response: NextApiResponse,
  code: string,
  exception: GetPostsApplicationException
) {
  return response.status(404)
    .json({
      code,
      message: exception.message,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
