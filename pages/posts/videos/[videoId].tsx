import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { container } from '~/awailix.container'
import { VideoPage, VideoPageProps } from '~/components/pages/VideoPage/VideoPage'
import { GetPostById } from '~/modules/Posts/Application/GetPostById/GetPostById'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '~/pages/api/auth/[...nextauth]'

export const getServerSideProps: GetServerSideProps<VideoPageProps> = async (context) => {
  let videoId = context.query.videoId

  const locale = context.locale ?? 'en'

  if (!videoId) {
    return {
      notFound: true,
    }
  }

  videoId = videoId.toString()
  const session = await getServerSession(context.req, context.res, authOptions)

  const useCase = container.resolve<GetPostById>('getPostById')
  const getRelatedPosts = container.resolve<GetRelatedPosts>('getRelatedPosts')

  try {
    const postWithCount = await useCase.get({
      postId: videoId,
      userId: session ? session.user.id : null,
    })
    const relatedPosts = await getRelatedPosts.get(videoId)

    console.log(postWithCount.userReaction)

    return {
      props: {
        post: PostComponentDtoTranslator.fromApplicationDto(
          postWithCount.post,
          postWithCount.comments,
          postWithCount.reactions,
          postWithCount.views,
          postWithCount.userReaction,
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
            'carousel',
            'post_card',
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
