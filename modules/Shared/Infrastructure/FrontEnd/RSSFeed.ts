import RSS from 'rss'
import { PostWithRelationsApplicationDto } from '~/modules/Posts/Application/Dtos/PostWithRelationsApplicationDto'

export const generateRssFeed = async (posts: PostWithRelationsApplicationDto[]) => {
  const { env } = process

  // Read .env vars
  let baseUrl = ''
  let siteImageUrl = ''
  let rssSiteName = ''
  let rssDescription = ''
  let rssAuthor = ''

  if (env.BASE_URL) {
    baseUrl = String(env.BASE_URL)
  }

  if (env.NEXT_PUBLIC_WEBSITE_IMAGE_URL) {
    siteImageUrl = String(env.NEXT_PUBLIC_WEBSITE_IMAGE_URL)
  }

  if (env.NEXT_PUBLIC_WEBSITE_IMAGE_URL) {
    siteImageUrl = String(env.NEXT_PUBLIC_WEBSITE_IMAGE_URL)
  }

  if (env.RSS_SITE_NAME) {
    rssSiteName = String(env.RSS_SITE_NAME)
  }

  if (env.RSS_DESCRIPTION) {
    rssDescription = String(env.RSS_DESCRIPTION)
  }

  if (env.RSS_AUTHOR) {
    rssAuthor = String(env.RSS_AUTHOR)
  }

  const feedOptions: RSS.FeedOptions = {
    title: rssSiteName,
    description: rssDescription,
    site_url: baseUrl,
    feed_url: `${baseUrl}/rss.xml`,
    image_url: `${siteImageUrl}`,
    pubDate: new Date(),
  }

  const feed = new RSS(feedOptions)

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${baseUrl}/posts/videos/${post.slug}`,
      date: post.publishedAt,
      author: rssAuthor,
    })
  })

  return feed.xml()
}
