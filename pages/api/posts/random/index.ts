import { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import { POST_METHOD, POST_SERVER_ERROR } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { GetRandomPostSlug } from '~/modules/Posts/Application/GetRandomPostSlug/GetRandomPostSlug'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const useCase = container.resolve<GetRandomPostSlug>('getRandomPostSlugUseCase')

  try {
    const postSlug = await useCase.get()

    response.setHeader('Cache-Control', 'no-store')

    response
      .status(200)
      .json({ postSlug })
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
      code: POST_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: POST_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
