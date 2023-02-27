import { GetServerSideProps } from 'next'
import { bindings } from '../../../modules/Posts/Infrastructure/Bindings'
import { GetPostById } from '../../../modules/Posts/Application/GetPostById'
import { PostComponentDtoTranslator } from '../../../modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import { VideoPage, VideoPageProps } from '../../../Components/pages/VideoPage/VideoPage'
import { DateTime } from 'luxon'

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
        post: PostComponentDtoTranslator.fromApplicationDto(post),
        comments: [
          {
              comment: 'Prueba',
              createdAt: DateTime.now().toISO(),
              id: '1',
              parentCommentId: null,
              postId: '111',
              updatedAt: DateTime.now().toISO(),
              user: {
                createdAt: DateTime.now().toISO(),
                emailVerified: DateTime.now().toISO(),
                email: 'asdasd',
                id: '0asd',
                imageUrl: 'https://s.alamy.com/kdawwlsweh27/2LtummpjO849eQ83yGGiUN/b33c73279163c84b65241cdfcc1c8844/Fresh_Stock_Content.jpg?fm=jpg&q=100',
                language: 'es',
                name: 'Jsjsj',
                updatedAt: DateTime.now().toISO()
              },
              userId: '',
            childComments: [
            {
              childComments: [],
              comment: 'Prueba1',
              createdAt: DateTime.now().toISO(),
              id: '11',
              parentCommentId: null,
              postId: '111',
              updatedAt: DateTime.now().toISO(),
              user: {
                createdAt: DateTime.now().toISO(),
                emailVerified: DateTime.now().toISO(),
                email: 'asdasd',
                id: '0asd',
                imageUrl: 'https://s.alamy.com/kdawwlsweh27/2LtummpjO849eQ83yGGiUN/b33c73279163c84b65241cdfcc1c8844/Fresh_Stock_Content.jpg?fm=jpg&q=100',
                language: 'es',
                name: 'Jsjsj',
                updatedAt: DateTime.now().toISO()
              },
              userId: ''
            }
          ] }
        ]
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