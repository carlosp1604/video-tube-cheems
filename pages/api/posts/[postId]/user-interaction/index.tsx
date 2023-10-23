import { NextApiRequest, NextApiResponse } from 'next'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import {
  POST_USER_INTERACTION_AUTH_REQUIRED,
  POST_USER_INTERACTION_BAD_REQUEST, POST_USER_INTERACTION_METHOD, POST_USER_INTERACTION_SERVER_ERROR,
  POST_USER_INTERACTION_VALIDATION
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { container } from '~/awilix.container'
import {
  GetPostUserInteractionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostUserInteractionApiRequestDto'
import {
  GetPostUserInteractionApiRequestValidator
} from '~/modules/Posts/Infrastructure/Api/Validators/GetPostUserInteractionApiRequestValidator'
import { GetPostUserInteraction } from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteraction'
import {
  GetPostUserInteractionDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/GetPostUserInteractionDtoTranslator'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const { postId } = request.query

  if (!postId) {
    return handleBadRequest(response)
  }

  const apiRequest: GetPostUserInteractionApiRequestDto = {
    postId: String(postId),
    userId: session.user.id,
  }

  const validationError = GetPostUserInteractionApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = GetPostUserInteractionDtoTranslator.fromApiDto(apiRequest)

  const useCase = container.resolve<GetPostUserInteraction>('getPostUserInteractionUseCase')

  try {
    const reaction = await useCase.get(applicationRequest)

    return response.status(200).json(reaction)
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
      code: POST_USER_INTERACTION_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleAuthentication (request: NextApiRequest, response: NextApiResponse) {
  const baseUrl = container.resolve<string>('baseUrl')

  response.setHeader(
    'WWW-Authenticate',
    `Basic realm="${baseUrl}"`
  )

  return response
    .status(401)
    .json({
      code: POST_USER_INTERACTION_AUTH_REQUIRED,
      message: 'User must be authenticated to access to resource',
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: POST_USER_INTERACTION_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: POST_USER_INTERACTION_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_USER_INTERACTION_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
