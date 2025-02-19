import { container } from '~/awilix.container'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { GetServerSideProps } from 'next'
import { PostPage, PostPageProps } from '~/components/pages/PostPage/PostPage'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { Duration, Settings } from 'luxon'

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (context) => {
  if (!context.query.slug) {
    return {
      notFound: true,
    }
  }

  const { env } = process
  const slug = String(context.query.slug)
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')
  const getRelatedPosts = container.resolve<GetRelatedPosts>('getRelatedPostsUseCase')
  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  try {
    const postWithCount = await useCase.get({ slug })

    if (postWithCount.externalLink) {
      const pat = /^https?:\/\//i

      if (pat.test(postWithCount.externalLink)) {
        return {
          redirect: {
            destination: postWithCount.externalLink,
            permanent: false,
          },
        }
      }

      return {
        redirect: {
          destination: `/${locale}/${postWithCount.externalLink}`,
          permanent: false,
        },
      }
    }

    if (postWithCount.post.deletedAt) {
      return {
        notFound: true,
      }
    }

    const relatedPosts = await getRelatedPosts.get(postWithCount.post.id)

    let baseUrl = ''

    if (!env.BASE_URL) {
      throw Error('Missing env var: BASE_URL. Required to build post page embed URL')
    } else {
      baseUrl = env.BASE_URL
    }

    const applicationPost = PostComponentDtoTranslator.fromApplicationDto(postWithCount.post, locale)

    const postComponentDto = PostComponentDtoTranslator.fromApplicationDto(postWithCount.post, locale)

    // Experimental: Try to improve performance
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=60'
    )

    return {
      props: {
        post: postComponentDto,
        relatedPosts: relatedPosts.posts.map((relatedPost) => {
          return PostCardComponentDtoTranslator.fromApplication(relatedPost.post, relatedPost.postViews, locale)
        }),
        parsedDuration: Duration.fromMillis(Number.parseInt(applicationPost.duration) * 1000).toString(),
        postViewsNumber: postWithCount.views,
        postLikes: postWithCount.reactions.like,
        postDislikes: postWithCount.reactions.dislike,
        postCommentsNumber: postWithCount.comments,
        postEmbedUrl: postComponentDto.postMediaEmbedType[0].urls[0].url,
        baseUrl,
        htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
      },
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default PostPage
