import { GetServerSideProps, NextPage } from 'next'
import styles from '~/components/pages/HomePage/HomePage.module.scss'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
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
  PaginatedPostCardGallery
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
import { container } from '~/awailix.container'

interface Props {
  posts: PostCardComponentDto[]
  producers: ProducerComponentDto[]
  postsNumber: number
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const getPosts = container.resolve<GetPosts>('getPosts')
  const getProducers = container.resolve<GetAllProducers>('getAllProducers')

  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'all_producers',
    'app_menu',
    'menu_options',
    'sorting_menu_dropdown',
    'user_menu',
    'carousel',
    'post_card',
    'user_signup',
    'user_login',
    'user_retrieve_password',
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
      return PostCardComponentDtoTranslator.fromApplication(
        post.post,
        post.postReactions,
        post.postComments,
        post.postViews,
        locale
      )
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
  const { t } = useTranslation('all_producers')

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        setActiveProducer={ setActiveProducer }
        activeProducer={ activeProducer }
      />

      <PaginatedPostCardGallery
        title={ activeProducer.id === '' ? t('all_producers_title') : activeProducer.name }
        initialPosts={ posts }
        initialPostsNumber={ postsNumber }
        filters={ [{
          type: PostFilterOptions.PRODUCER_ID,
          value: activeProducer.id === '' ? null : activeProducer.id,
        }] }
      />
    </div>
  )
}

export default HomePage
