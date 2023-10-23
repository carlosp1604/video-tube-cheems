import type { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'
import {
  USER_AUTH_REQUIRED,
  USER_BAD_REQUEST,
  USER_FORBIDDEN,
  USER_METHOD,
  USER_POST_NOT_FOUND, USER_SAVED_POSTS_CANNOT_DELETE_POST_FROM_SAVED_POSTS,
  USER_SAVED_POSTS_POST_ALREADY_ADDED,
  USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS,
  USER_SERVER_ERROR,
  USER_USER_NOT_FOUND,
  USER_VALIDATION
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { AddSavedPostApiRequest } from '~/modules/Auth/Infrastructure/Api/Requests/AddSavedPostApiRequest'
import {
  AddSavedPostApiRequestValidator
} from '~/modules/Auth/Infrastructure/Api/Validators/AddSavedPostApiRequestValidator'
import {
  AddSavedPostApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/Api/Translators/AddSavedPostApplicationRequestTranslator'
import { AddSavedPost } from '~/modules/Auth/Application/AddSavedPost/AddSavedPost'
import {
  AddSavedPostApplicationException
} from '~/modules/Auth/Application/AddSavedPost/AddSavedPostApplicationException'
import { DeleteSavedPostApiRequest } from '~/modules/Auth/Infrastructure/Api/Requests/DeleteSavedPostApiRequest'
import {
  DeleteSavedPostApiRequestValidator
} from '~/modules/Auth/Infrastructure/Api/Validators/DeleteSavedPostApiRequestValidator'
import {
  DeleteSavedPostApplicationRequestTranslator
} from '~/modules/Auth/Infrastructure/Api/Translators/DeleteSavedPostApplicationRequestTranslator'
import { DeleteSavedPost } from '~/modules/Auth/Application/DeleteSavedPost/DeleteSavedPost'
import {
  DeleteSavedPostApplicationException
} from '~/modules/Auth/Application/DeleteSavedPost/DeleteSavedPostApplicationException'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST':
      return handlePost(request, response)

    case 'DELETE':
      return handleDelete(request, response)

    default:
      handleMethod(response)
  }
}

async function handlePost (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthorizationRequired(response)
  }

  const { userEmail: userId, postId } = request.query

  if (!userId || !postId) {
    return handleBadRequest(response)
  }

  if (session.user.id !== userId) {
    return handleForbidden(response)
  }

  const apiRequest: AddSavedPostApiRequest = {
    userId: String(userId),
    postId: String(postId),
  }

  const validationExceptions = AddSavedPostApiRequestValidator.validate(apiRequest)

  if (validationExceptions) {
    return handleValidation(response, validationExceptions)
  }

  const applicationRequest = AddSavedPostApplicationRequestTranslator.fromApi(apiRequest)

  const useCase = container.resolve<AddSavedPost>('addSavedPostUseCase')

  try {
    const post = await useCase.add(applicationRequest)

    return response.status(201).json(post)
  } catch (exception: unknown) {
    if (!(exception instanceof AddSavedPostApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case AddSavedPostApplicationException.userNotFoundId:
        return handleNotFound(response, exception.message, USER_USER_NOT_FOUND)

      case AddSavedPostApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message, USER_POST_NOT_FOUND)

      case AddSavedPostApplicationException.postPostAlreadyAddedId:
        return handleConflict(response, exception.message, USER_SAVED_POSTS_POST_ALREADY_ADDED)

      default: {
        console.error(exception)

        return handleInternalError(response)
      }
    }
  }
}

async function handleDelete (request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions)

  if (session === null) {
    return handleAuthorizationRequired(response)
  }

  const { userEmail: userId, postId } = request.query

  if (!userId || !postId) {
    return handleBadRequest(response)
  }

  if (session.user.id !== userId) {
    return handleForbidden(response)
  }

  const apiRequest: DeleteSavedPostApiRequest = {
    userId: String(userId),
    postId: String(postId),
  }

  const validationExceptions = DeleteSavedPostApiRequestValidator.validate(apiRequest)

  if (validationExceptions) {
    return handleValidation(response, validationExceptions)
  }

  const applicationRequest = DeleteSavedPostApplicationRequestTranslator.fromApi(apiRequest)

  const useCase = container.resolve<DeleteSavedPost>('deleteSavedPostUseCase')

  try {
    const post = await useCase.delete(applicationRequest)

    return response.status(201).json(post)
  } catch (exception: unknown) {
    if (!(exception instanceof DeleteSavedPostApplicationException)) {
      console.error(exception)

      return handleInternalError(response)
    }

    switch (exception.id) {
      case DeleteSavedPostApplicationException.userNotFoundId:
        return handleNotFound(response, exception.message, USER_USER_NOT_FOUND)

      case DeleteSavedPostApplicationException.postNotFoundId:
        return handleNotFound(response, exception.message, USER_POST_NOT_FOUND)

      case DeleteSavedPostApplicationException.cannotDeletePostFromSavedPostsId:
        return handleConflict(response, exception.message, USER_SAVED_POSTS_CANNOT_DELETE_POST_FROM_SAVED_POSTS)

      case DeleteSavedPostApplicationException.postDoesNotExistOnSavedPostsId:
        return handleConflict(response, exception.message, USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS)

      default: {
        console.error(exception)

        return handleInternalError(response)
      }
    }
  }
}

function handleNotFound (response: NextApiResponse, message: string, code: string) {
  return response.status(404)
    .json({
      code,
      message,
    })
}

function handleMethod (response: NextApiResponse) {
  return response
    .setHeader('Allow', ['POST', 'DELETE'])
    .status(405)
    .json({
      code: USER_METHOD,
      message: 'HTTP method not allowed',
    })
}

function handleValidation (
  response: NextApiResponse,
  validationException: UserApiValidationException
) {
  return response
    .status(400)
    .json({
      code: USER_VALIDATION,
      message: 'Invalid request',
      errors: validationException.exceptions,
    })
}

function handleBadRequest (response: NextApiResponse) {
  return response
    .status(400)
    .json({
      code: USER_BAD_REQUEST,
      message: 'userId and postId parameters are required',
    })
}

function handleInternalError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: USER_SERVER_ERROR,
      message: 'Something went wrong while processing request',
    })
}

function handleAuthorizationRequired (response: NextApiResponse) {
  return response
    .status(401)
    .json({
      code: USER_AUTH_REQUIRED,
      message: 'User not authenticated',
    })
}

function handleConflict (response: NextApiResponse, message: string, code: string) {
  return response
    .status(409)
    .json({
      code,
      message,
    })
}

function handleForbidden (response: NextApiResponse) {
  return response
    .status(403)
    .json({
      code: USER_FORBIDDEN,
      message: 'User does not have access to the resource',
    })
}
