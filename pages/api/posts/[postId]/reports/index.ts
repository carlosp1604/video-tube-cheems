import { NextApiRequest, NextApiResponse } from 'next'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import { container } from '~/awilix.container'
import { CreateReportApiRequestDto } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestDto'
import { CreateReportApiRequestSanitizer } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestSanitizer'
import { CreateReportApiRequestValidator } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestValidator'
import { CreateReportRequestDtoTranslator } from '~/modules/Reports/Infrastructure/Api/CreateReportRequestDtoTranslator'
import { CreateReport } from '~/modules/Reports/Application/CreateReport'
import {
  REPORT_AUTH_REQUIRED,
  REPORT_BAD_REQUEST,
  REPORT_CREATE_REPORT_POST_ALREADY_REPORTED, REPORT_CREATE_REPORT_POST_NOT_FOUND, REPORT_CREATE_REPORT_USER_NOT_FOUND,
  REPORT_METHOD,
  REPORT_SERVER_ERROR,
  REPORT_VALIDATION
} from '~/modules/Reports/Infrastructure/Api/ReportApiExceptionCodes'
import { CreateReportApplicationException } from '~/modules/Reports/Application/CreateReportApplicationException'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return handleMethod(request, response)
  }

  const { postId } = request.query
  const content = request.body.content

  if (!postId) {
    return handleBadRequest(response)
  }

  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthentication(request, response)
  }

  const userId = session.user.id

  let apiRequest: CreateReportApiRequestDto

  try {
    apiRequest = CreateReportApiRequestSanitizer.sanitize({
      content,
      postId: String(postId),
    })
  } catch (exception: unknown) {
    console.error(exception)

    return handleServerError(response)
  }

  const validationError = CreateReportApiRequestValidator.validate(apiRequest)

  if (validationError) {
    return handleValidationError(response, validationError)
  }

  const applicationRequest = CreateReportRequestDtoTranslator.fromApiDto(apiRequest, userId)

  const useCase = container.resolve<CreateReport>('createReportUseCase')

  try {
    await useCase.create(applicationRequest)

    return response.status(201).end()
  } catch (exception: unknown) {
    if (!(exception instanceof CreateReportApplicationException || exception instanceof ValidationException)) {
      console.error(exception)

      return handleServerError(response)
    }

    switch (exception.id) {
      case CreateReportApplicationException.postNotFoundId:
        return handleNotFound(response, REPORT_CREATE_REPORT_POST_NOT_FOUND, exception.message)

      case CreateReportApplicationException.userNotFoundId:
        return handleNotFound(response, REPORT_CREATE_REPORT_USER_NOT_FOUND, exception.message)

      case CreateReportApplicationException.postAlreadyReportedByUserId:
        return handleConflict(response, exception.message)

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
      code: REPORT_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleAuthentication (request: NextApiRequest, response: NextApiResponse) {
  return response
    .status(401)
    .json({
      code: REPORT_AUTH_REQUIRED,
      message: 'User must be authenticated to access to resource',
    })
}

function handleValidationError (
  response: NextApiResponse,
  validationError: PostsApiRequestValidatorError
) {
  return response.status(400)
    .json({
      code: REPORT_VALIDATION,
      message: 'Invalid request',
      errors: validationError.exceptions,
    })
}

function handleNotFound (response: NextApiResponse, code: string, message: string) {
  return response.status(404)
    .json({
      code,
      message,
    })
}

function handleConflict (response: NextApiResponse, message: string) {
  return response.status(409)
    .json({
      code: REPORT_CREATE_REPORT_POST_ALREADY_REPORTED,
      message,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response.status(400)
    .json({
      code: REPORT_BAD_REQUEST,
      message: 'postId parameter is required',
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: REPORT_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
