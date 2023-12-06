import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { container } from '~/awilix.container'
import { PostPage, VideoPageProps } from '~/components/pages/PostPage/PostPage'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'

export const getServerSideProps: GetServerSideProps<VideoPageProps> = async (context) => {
  if (!context.query.slug) {
    return {
      notFound: true,
    }
  }

  const slug = String(context.query.slug)
  const locale = context.locale ?? 'en'

  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')
  const getRelatedPosts = container.resolve<GetRelatedPosts>('getRelatedPostsUseCase')

  try {
    const postWithCount = await useCase.get({ slug })

    const relatedPosts = await getRelatedPosts.get(postWithCount.post.id)

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
        ...await serverSideTranslations(
          locale,
          [
            'user_menu',
            'app_menu',
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
