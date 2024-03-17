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
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { AddActorView } from '~/modules/Actors/Application/AddActorView/AddActorView'
import { getSession } from 'next-auth/react'

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
    'app_banner',
    'footer',
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
    'actors',
  ])

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the actor page')
  } else {
    baseUrl = env.BASE_URL
  }

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
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    baseUrl,
    ...i18nSSRConfig,
  }

  const getActor = container.resolve<GetActorBySlug>('getActorBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const addActorView = container.resolve<AddActorView>('addActorViewUseCase')

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

    // TODO: Maybe we need to move this to an endpoint so its called from client side
    const session = await getSession()
    let userId: string | null = null

    if (session) {
      userId = session.user.id
    }

    await addActorView.add({ actorSlug: String(actorSlug), userId })

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
