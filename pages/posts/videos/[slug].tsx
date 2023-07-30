import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { container } from '~/awilix.container'
import { VideoPage, VideoPageProps } from '~/components/pages/VideoPage/VideoPage'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import { GetPostUserReaction } from '~/modules/Posts/Application/GetPostUserReaction/GetPostUserReaction'
import { PostReactionApplicationDto } from '~/modules/Posts/Application/Dtos/PostReactionApplicationDto'

export const getServerSideProps: GetServerSideProps<VideoPageProps> = async (context) => {
  let slug = context.query.slug

  const locale = context.locale ?? 'en'

  if (!slug) {
    return {
      notFound: true,
    }
  }

  slug = slug.toString()
  const session = await getServerSession(context.req, context.res, authOptions)

  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')
  const getRelatedPosts = container.resolve<GetRelatedPosts>('getRelatedPostsUseCase')
  const getPostUserReaction = container.resolve<GetPostUserReaction>('getPostUserReactionUseCase')

  try {
    const postWithCount = await useCase.get({ slug })
    const relatedPosts = await getRelatedPosts.get(postWithCount.post.id)

    let userReaction: PostReactionApplicationDto | null = null

    if (session !== null) {
      userReaction = await getPostUserReaction.get({ postId: postWithCount.post.id, userId: session.user.id })
    }

    return {
      props: {
        post: PostComponentDtoTranslator.fromApplicationDto(
          postWithCount.post,
          postWithCount.comments,
          postWithCount.reactions,
          postWithCount.views,
          userReaction,
          locale
        ),
        relatedPosts: relatedPosts.posts.map((relatedPost) => {
          return PostCardComponentDtoTranslator.fromApplication(
            relatedPost.post,
            relatedPost.postReactions,
            relatedPost.postComments,
            relatedPost.postViews,
            locale
          )
        }),
        ...await serverSideTranslations(
          locale,
          [
            'user_menu',
            'app_menu',
            'menu_options',
            'post_comments',
            'video_page',
            'video',
            'carousel',
            'post_card',
            'user_signup',
            'user_login',
            'user_retrieve_password',
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

export default VideoPage
