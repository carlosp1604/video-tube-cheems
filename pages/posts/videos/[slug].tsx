import { container } from '~/awilix.container'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PostPage, PostPageProps } from '~/components/pages/PostPage/PostPage'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (context) => {
  if (!context.query.slug) {
    return {
      notFound: true,
    }
  }

  const { env } = process
  const slug = String(context.query.slug)
  const locale = context.locale ?? 'en'

  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')
  const getRelatedPosts = container.resolve<GetRelatedPosts>('getRelatedPostsUseCase')
  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  try {
    const postWithCount = await useCase.get({ slug })

    const relatedPosts = await getRelatedPosts.get(postWithCount.post.id)

    let postEmbedUrl = ''

    if (!env.BASE_URL) {
      console.error('Missing env var: BASE_URL. Required to build post page embed URL')
    } else {
      postEmbedUrl = `${env.BASE_URL}/${locale}/posts/videos/embed/${slug}`
    }

    return {
      props: {
        post: PostComponentDtoTranslator.fromApplicationDto(postWithCount.post, locale),
        relatedPosts: relatedPosts.posts.map((relatedPost) => {
          return PostCardComponentDtoTranslator.fromApplication(relatedPost.post, relatedPost.postViews, locale)
        }),
        postViewsNumber: postWithCount.views,
        postLikes: postWithCount.reactions.like,
        postDislikes: postWithCount.reactions.dislike,
        postCommentsNumber: postWithCount.comments,
        postEmbedUrl,
        htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
        ...await serverSideTranslations(
          locale,
          [
            'user_menu',
            'app_menu',
            'app_banner',
            'footer',
            'menu',
            'post_comments',
            'post_page',
            'post',
            'carousel',
            'common',
            'post_card',
            'user_signup',
            'user_login',
            'user_retrieve_password',
            'api_exceptions',
            'api_exceptions',
            'post_card_options',
            'post_card_gallery',
          ]
        ),
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
