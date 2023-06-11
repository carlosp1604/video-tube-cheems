import { NextApiRequest, NextApiResponse } from 'next'
import { GetPostsApplicationException } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationException'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'
import { container } from '~/awailix.container'
import { AddPostViewApiRequestValidator }
  from '~/modules/Posts/Infrastructure/Validators/AddPostViewApiRequestValidator'
import { AddPostViewRequestTranslator } from '~/modules/Posts/Infrastructure/AddPostViewRequestTranslator'
import { AddPostView } from '~/modules/Posts/Application/AddPostView/AddPostView'
import {
  AddPostViewApplicationException
} from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(request, response)
  }

  const validationError = AddPostViewApiRequestValidator.validate(request.body)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = AddPostViewRequestTranslator.fromApiDto(request.body)

  const useCase = container.resolve<AddPostView>('addPostView')

  try {
    const posts = await useCase.add(applicationRequest)

    return response.status(200).json(posts)
  } catch (exception: unknown) {
    console.error(exception)
    if (!(exception instanceof AddPostViewApplicationException)) {
      return handleServerError(response)
    }

    switch (exception.id) {
      case AddPostViewApplicationException.postNotFoundId:
      case AddPostViewApplicationException.userNotFoundId:
        return handleNotFound(response, exception)

      default:
        console.error(exception)

        return handleServerError(response)
    }
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'POST')
    .json({
      code: 'post-views-method-not-allowed',
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: 'post-views-bad-request',
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
      code: 'post-views-not-found',
      message: exception.message,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: 'post-views-server-error',
      message: 'Something went wrong while processing the request',
    })
}
