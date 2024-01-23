import { GetServerSideProps } from 'next'
import { GetActorBySlug } from '~/modules/Actors/Application/GetActorBySlug/GetActorBySlug'
import { ActorPageComponentDtoTranslator } from '~/modules/Actors/Infrastructure/ActorPageComponentDtoTranslator'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { container } from '~/awilix.container'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { ActorPage, ActorPageProps } from '~/components/pages/ActorPage/ActorPage'

export const getServerSideProps: GetServerSideProps<ActorPageProps> = async (context) => {
  const actorSlug = context.query.actorSlug

  if (!actorSlug) {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'app_menu',
    'menu',
    'sorting_menu_dropdown',
    'user_menu',
    'post_card',
    'user_signup',
    'user_login',
    'user_retrieve_password',
    'pagination_bar',
    'common',
    'api_exceptions',
    'post_card_options',
    'post_card_gallery',
    'actor_page',
  ])

  const props: ActorPageProps = {
    actor: {
      description: null,
      slug: '',
      name: '',
      imageUrl: '',
      id: '',
    },
    initialPosts: [],
    initialPostsNumber: 0,
    ...i18nSSRConfig,
  }

  const getActor = container.resolve<GetActorBySlug>('getActorBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const actor = await getActor.get(actorSlug.toString())

    props.actor = ActorPageComponentDtoTranslator.fromApplicationDto(actor)
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }

  try {
    const actorPosts = await getPosts.get({
      page: 1,
      filters: [{ type: PostFilterOptions.ACTOR_SLUG, value: String(actorSlug) }],
      sortCriteria: InfrastructureSortingCriteria.DESC,
      sortOption: InfrastructureSortingOptions.DATE,
      postsPerPage: defaultPerPage,
    })

    props.initialPosts = actorPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.initialPostsNumber = actorPosts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props,
  }
}

export default ActorPage
