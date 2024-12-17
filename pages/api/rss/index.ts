import { NextApiRequest, NextApiResponse } from 'next'
import { container } from '~/awilix.container'
import { RSS_METHOD, RSS_SERVER_ERROR } from '~/modules/Shared/Infrastructure/Api/SharedApiExceptionCodes'
import { GetPostsPublishedOnDate } from '~/modules/Posts/Application/GetPostsPublishedOnDate/GetPostsPublishedOnDate'
import { generateRssFeed } from '~/modules/Shared/Infrastructure/FrontEnd/RSSFeed'
import { DateService } from '~/helpers/Infrastructure/DateService'

export const dynamic = 'force-dynamic'

export default async function handler (
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return handleMethod(request, response)
  }

  const useCase = container.resolve<GetPostsPublishedOnDate>('getPostsPublishedOnDateUseCase')

  try {
    const todayDate = new DateService().getCurrentDayWithoutTime()
    const posts = await useCase.get(todayDate)

    const xml = await generateRssFeed(posts)

    response.status(200)
      .setHeader('Cache-Control', 'public, max-age=60, must-revalidate')
      .setHeader('Content-Type', 'text/xml')
      .send(xml)
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
      code: RSS_METHOD,
      message: `Cannot ${request.method} ${request.url?.toString()}`,
    })
}

function handleServerError (response: NextApiResponse) {
  return response.status(500)
    .json({
      code: RSS_SERVER_ERROR,
      message: 'Something went wrong while processing the request',
    })
}
