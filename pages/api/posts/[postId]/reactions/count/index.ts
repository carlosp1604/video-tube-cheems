import { NextApiRequest, NextApiResponse } from 'next'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import {
  POST_REACTION_BAD_REQUEST,
  POST_REACTION_METHOD, POST_REACTION_SERVER_ERROR, POST_REACTION_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { container } from '~/awilix.container'
import {
  GetPostReactionsCountApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/GetPostReactionsCountApiRequestValidator'
import {
  GetPostReactionsCountApiRequest
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostReactionsCountApiRequestDto'
import {
  GetPostReactionsCountRequestDtoTranslator
} from '~/modules/Posts/Infrastructure/Api/Translators/GetPostReactionsCountRequestDtoTranslator'
import { GetPostReactionsCount } from '~/modules/Posts/Application/GetPostReactionsCount/GetPostReactionsCount'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const { postId } = request.query

  if (!postId) {
    return handleBadRequest(response)
  }

  const apiRequest: GetPostReactionsCountApiRequest = {
    postId: String(postId),
  }

  const validationError = GetPostReactionsCountApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = GetPostReactionsCountRequestDtoTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<GetPostReactionsCount>('getPostReactionsCountUseCase')

  try {
    const reactionsCount = await useCase.get(applicationRequest)

    response.setHeader('Cache-Control', 'no-store')

    return response.status(200).json(reactionsCount)
  } catch (exception: unknown) {
    console.error(exception)

    return handleServerError(response)
  }
}

function handleMethod (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(405)
    .setHeader('Allow', 'GET')
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

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: POST_REACTION_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_REACTION_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
