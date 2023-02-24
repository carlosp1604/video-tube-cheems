import { GetServerSideProps } from 'next'
import { bindings } from '../../../modules/Posts/Infrastructure/Bindings'
import { GetPostById } from '../../../modules/Posts/Application/GetPostById'
import { PostComponentDtoTranslator } from '../../../modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import { VideoPage, VideoPageProps } from '../../../Components/pages/VideoPage/VideoPage'

export const getServerSideProps: GetServerSideProps<VideoPageProps> = async (context) => {
  let videoId = context.query.videoId


  if (!videoId) {
    return {
      notFound: true
    }
  }

  videoId = videoId.toString()

  const useCase = bindings.get<GetPostById>('GetPostById')

  try {
    const post = await useCase.get(videoId)

    return {
      props: {
        post: PostComponentDtoTranslator.fromApplicationDto(post)
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