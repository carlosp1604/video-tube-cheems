import { GetServerSideProps } from 'next'
import { bindings } from '../../../modules/Posts/Infrastructure/Bindings'
import { GetPostById } from '../../../modules/Posts/Application/GetPostById'
import { PostComponentDtoTranslator } from '../../../modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import { VideoPage, VideoPageProps } from '../../../Components/pages/VideoPage/VideoPage'
import { PostCardComponentDtoTranslator } from '../../../modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { GetRelatedPosts } from '../../../modules/Posts/Application/GetRelatedPosts'

export const getServerSideProps: GetServerSideProps<VideoPageProps> = async (context) => {
  let videoId = context.query.videoId

  const locale = context.locale ?? 'en'

  if (!videoId) {
    return {
      notFound: true
    }
  }

  videoId = videoId.toString()

  const useCase = bindings.get<GetPostById>('GetPostById')
  const getRelatedPosts = bindings.get<GetRelatedPosts>('GetRelatedPosts')

  try {
    const postWithCount = await useCase.get(videoId)
    const relatedPosts = await getRelatedPosts.get(videoId)

    return {
      props: {
        post: PostComponentDtoTranslator.fromApplicationDto(
          postWithCount.post,
          postWithCount.comments,
          postWithCount.reactions,
          locale
        ),
        relatedPosts: relatedPosts.posts.map((relatedPost) => {
          return PostCardComponentDtoTranslator.fromApplication(relatedPost.post, 0, 0, locale)
        })
      }
    }
  }
  catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true
    }
  }
}

export default VideoPage