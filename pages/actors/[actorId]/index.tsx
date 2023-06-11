import { GetServerSideProps } from 'next'
import { bindings as ActorBindings } from '~/modules/Actors/Infrastructure/Bindings'
import { bindings as PostBindings } from '~/modules/Posts/Infrastructure/Bindings'
import { ActorPageProps, ActorPage } from '~/components/pages/ActorPage/ActorPage'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetActor } from '~/modules/Actors/Application/GetActor'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { ActorPageComponentDtoTranslator } from '~/modules/Actors/Infrastructure/ActorPageComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'

export const getServerSideProps: GetServerSideProps<ActorPageProps> = async (context) => {
  const actorId = context.query.actorId

  if (!actorId) {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

  const getPosts = PostBindings.get<GetPosts>('GetPosts')
  const getActor = ActorBindings.get<GetActor>('GetActor')

  try {
    const actor = await getActor.get(actorId.toString())
    const posts = await getPosts.get({
      filters: [
        { type: 'actorId', value: actorId.toString() },
      ],
      page: 1,
      postsPerPage: defaultPerPage,
      sortCriteria: 'desc',
      sortOption: 'date',
    })

    return {
      props: {
        actor: ActorPageComponentDtoTranslator.fromApplicationDto(actor),
        posts: posts.posts.map((post) => {
          return PostCardComponentDtoTranslator
            .fromApplication(post.post, post.postReactions, post.postComments, 0, locale)
        }),
        postsNumber: posts.postsNumber,
      },
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default ActorPage
