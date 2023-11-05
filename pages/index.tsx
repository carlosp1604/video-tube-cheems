import { GetServerSideProps, NextPage } from 'next'
import styles from '~/components/pages/HomePage/HomePage.module.scss'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  ProducerListComponentDtoTranslator
} from '~/modules/Producers/Infrastructure/Translators/ProducerListComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  PaginatedPostCardGallery,
  PostCardGalleryAction,
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { container } from '~/awilix.container'
import {
  HomePostsDefaultSortingOption,
  HomePostsSortingOptions, SortingOption
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { signOut, useSession } from 'next-auth/react'
import { BiLike } from 'react-icons/bi'
import { BsBookmark } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { USER_USER_NOT_FOUND } from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'

interface Props {
  posts: PostCardComponentDto[]
  producers: ProducerComponentDto[]
  postsNumber: number
}

// TODO:
// producer=producer&order=asc/desc&orderBy=date/views&page=1
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const getProducers = container.resolve<GetAllProducers>('getAllProducers')

  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'home_page',
    'app_menu',
    'menu',
    'sorting_menu_dropdown',
    'user_menu',
    'carousel',
    'post_card',
    'user_signup',
    'user_login',
    'user_retrieve_password',
    'pagination_bar',
    'common',
    'paginated_post_card_gallery',
    'api_exceptions',
  ])

  const props: Props = {
    posts: [],
    producers: [],
    postsNumber: 0,
    ...i18nSSRConfig,
  }

  try {
    const posts = await getPosts.get({
      page: 1,
      filters: [],
      sortCriteria: InfrastructureSortingCriteria.DESC,
      sortOption: InfrastructureSortingOptions.DATE,
      postsPerPage: defaultPerPage,
    })

    const producers = await getProducers.get()
    const producerComponents = producers.map((producer) => {
      return ProducerListComponentDtoTranslator.fromApplication(producer)
    })

    // Add default producer
    producerComponents.unshift(allPostsProducerDto)

    props.posts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.postsNumber = posts.postsNumber
    props.producers = producerComponents
  } catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props,
  }
}

const HomePage: NextPage<Props> = ({ postsNumber, posts, producers }) => {
  const [activeProducer, setActiveProducer] = useState<ProducerComponentDto>(allPostsProducerDto)
  const { t } = useTranslation(['home_page', 'api_exceptions'])
  const { status, data } = useSession()

  let options: PostCardGalleryOption[] = []

  const savePostPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'home_page' }))

      return
    }

    try {
      await new PostsApiService().savePost(data.user.id, postId)

      toast.success(t('post_save_post_successfully_saved', { ns: 'home_page' }))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === USER_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }
  }

  const likePostPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'home_page' }))

      return
    }

    try {
      await new PostsApiService().createPostReaction(postId, ReactionType.LIKE)

      toast.success(t('post_reaction_added_correctly_message', { ns: 'home_page' }))
    } catch (exception) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === USER_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }
  }

  if (status === 'authenticated' && data) {
    options = [
      {
        action: PostCardGalleryAction.NO_MUTATE,
        icon: <BiLike />,
        title: t('like_post_post_card_gallery_action_title', { ns: 'home_page' }),
        onClick: (postId: string) => likePostPostCardAction(postId),
      },
      {
        action: PostCardGalleryAction.NO_MUTATE,
        icon: <BsBookmark />,
        title: t('save_post_post_card_gallery_action_title', { ns: 'home_page' }),
        onClick: (postId: string) => savePostPostCardAction(postId),
      },
    ]
  }

  const fetchPosts = async (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) => {
    return (new PostsApiService())
      .getPosts(
        pageNumber,
        defaultPerPage,
        sortingOption.criteria,
        sortingOption.option,
        filters
      )
  }

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        setActiveProducer={ setActiveProducer }
        activeProducer={ activeProducer }
      />

      <PaginatedPostCardGallery
        title={ activeProducer.id === '' ? t('all_producers_title', { ns: 'home_page' }) : activeProducer.name }
        initialPosts={ posts }
        initialPostsNumber={ postsNumber }
        filters={ [{
          type: PostFilterOptions.PRODUCER_ID,
          value: activeProducer.id === '' ? null : activeProducer.id,
        }] }
        sortingOptions={ HomePostsSortingOptions }
        defaultSortingOption={ HomePostsDefaultSortingOption }
        postCardOptions={ options }
        fetchPosts={ fetchPosts }
        emptyState={ null }
      />
    </div>
  )
}

export default HomePage
