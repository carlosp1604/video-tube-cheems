import { NextPage } from 'next'
import { ReactElement, useEffect, useState } from 'react'
import styles from './ProducerPage.module.scss'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useRouter } from 'next/router'
import { useGetPosts } from '~/hooks/GetPosts'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import { useTranslation } from 'next-i18next'
import { ProducerPageComponentDto } from '~/modules/Producers/Infrastructure/ProducerPageComponentDto'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import {
  PostCardGalleryHeader
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryHeader'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { useFirstRender } from '~/hooks/FirstRender'

export interface ProducerPagePaginationState {
  page: number
  order: PostsPaginationSortingType
}

export interface ProducerPageProps {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  producer: ProducerPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const ProducerPage: NextPage<ProducerPageProps> = ({
  initialPage,
  initialOrder,
  producer,
  initialPosts,
  initialPostsNumber,
}) => {
  const [posts, setPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const [pagination, setPagination] = useState<ProducerPagePaginationState>({ page: initialPage, order: initialOrder })

  const { loading, getPosts } = useGetPosts()
  const firstRender = useFirstRender()
  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { t } = useTranslation('producer_page')

  const sortingOptions: PostsPaginationSortingType[] = [
    PostsPaginationSortingType.LATEST,
    PostsPaginationSortingType.OLDEST,
    PostsPaginationSortingType.MOST_VIEWED,
  ]

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: true,
    scrollOnClick: true,
  }

  const configuration: Partial<PostsPaginationConfiguration> &
    Pick<PostsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
      page: {
        defaultValue: 1,
        maxValue: Infinity,
        minValue: 1,
      },
      filters: { filtersToParse: [PostFilterOptions.PRODUCER_SLUG] },
      sortingOptionType: {
        defaultValue: PostsPaginationSortingType.LATEST,
        parseableOptionTypes: sortingOptions,
      },
    }

  useEffect(() => {
    if (firstRender) {
      return
    }

    const queryParams = new PostsPaginationQueryParams(router.query, configuration)

    const newPage = queryParams.page ?? configuration.page.defaultValue
    const newOrder = queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue

    if (newPage === pagination.page && newOrder === pagination.order) {
      return
    }

    setPagination({ page: newPage, order: newOrder })

    updatePosts(newPage, newOrder)
  }, [router.query])

  const updatePosts = async (page:number, order: PostsPaginationSortingType) => {
    try {
      const newPosts = await getPosts(
        page,
        order,
        [{ type: PostFilterOptions.PRODUCER_SLUG, value: producer.slug }]
      )

      if (newPosts) {
        setPosts(newPosts.posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
        }))

        setPostsNumber(newPosts.postsNumber)
      }
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  let content: ReactElement

  if (initialPostsNumber > 0 && !loading) {
    content = (
      <PostCardGallery
        posts={ posts }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        loading={ loading }
      />
    )
  } else {
    content = (
      <EmptyState
        title={ t('producer_posts_empty_state_title') }
        subtitle={ t('producer_posts_empty_state_subtitle', { producerName: producer.name }) }
      />
    )
  }

  return (
    <div className={ styles.producerPage__container }>
      <ProfileHeader
        name={ producer.name }
        imageAlt={ t('producer_image_alt_title', { producerName: producer.name }) }
        imageUrl={ producer.imageUrl }
        customColor={ producer.brandHexColor }
      />

      <PostCardGalleryHeader
        key={ router.asPath }
        title={ t('producer_posts_gallery_title', { producerName: producer.name }) }
        subtitle={ t('producer_posts_gallery_posts_quantity', { postsNumber }) }
        showSortingOptions={ postsNumber > defaultPerPage }
        activeOption={ pagination.order }
        sortingOptions={ sortingOptions }
        linkMode= { linkMode }
        loading={ loading }
      />

      { content }

      <PaginationBar
        availablePages={ PaginationHelper.getShowablePages(
          pagination.page, PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage)) }
        pageNumber={ pagination.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        linkMode={ { ...linkMode, scrollOnClick: false } }
        onPageChange={ () => window.scrollTo({ top: 0 }) }
      />
    </div>
  )
}
