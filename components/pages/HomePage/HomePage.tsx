import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import styles from '~/components/pages/HomePage/HomePage.module.scss'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList'
import {
  PostCardGalleryHeader
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryHeader'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { ParsedUrlQuery } from 'querystring'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  posts: PostCardComponentDto[]
  postsNumber: number
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
}

export const HomePage: NextPage<Props> = ({
  postsNumber,
  posts,
  producers,
  page,
  order,
  activeProducer,
}) => {
  const { t } = useTranslation(['home_page'])
  const router = useRouter()
  const { asPath, pathname } = router
  const locale = router.locale ?? 'en'

  const updateQuery = async (
    page: number,
    sortingOption: PostsPaginationSortingType,
    producer: ProducerComponentDto | null
  ) => {
    const newQuery: ParsedUrlQuery = {}

    if (producer && producer.slug !== allPostsProducerDto.slug) {
      newQuery.producerSlug = producer.slug
    }

    if (sortingOption !== PostsPaginationSortingType.LATEST) {
      newQuery.order = sortingOption
    }

    if (page !== 1) {
      newQuery.page = String(page)
    }

    await router.push({
      pathname,
      query: { ...newQuery },
    }, undefined, { shallow: false, scroll: true })
  }

  /** Component functions **/
  const onChangeOption = async (newOption: PostsPaginationSortingType) => {
    await updateQuery(1, newOption, activeProducer)
  }

  const onChangeProducer = async (producer: ProducerComponentDto) => {
    await updateQuery(1, order, producer)
  }

  const onChangePageNumber = async (pageNumber: number) => {
    await updateQuery(pageNumber, order, activeProducer)
  }

  let galleryTitle: string

  if (!activeProducer) {
    galleryTitle = t('post_gallery_no_producer_title')
  } else {
    galleryTitle = activeProducer.id === '' ? t('all_producers_title', { ns: 'home_page' }) : activeProducer.name
  }

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container } key={ asPath }>
      <ProducerList
        producers={ producers }
        onChangeProducer={ onChangeProducer }
        activeProducer={ activeProducer }
      />

      { postsNumber > 0
        ? <>
          <PostCardGalleryHeader
            key={ asPath }
            title={ galleryTitle }
            subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
            showSortingOptions={ postsNumber > defaultPerPage }
            activeOption={ order }
            sortingOptions={ [
              PostsPaginationSortingType.LATEST,
              PostsPaginationSortingType.OLDEST,
              PostsPaginationSortingType.MOST_VIEWED,
            ] }
            onChangeOption={ onChangeOption }
          />

          <PostCardGallery
            posts={ posts }
            postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
          />

          <PaginationBar
            availablePages={ PaginationHelper.getShowablePages(
              page, PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage)) }
            onPageNumberChange={ onChangePageNumber }
            pageNumber={ page }
            pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
          />
        </>
        : <EmptyState
          title={ t('post_gallery_empty_state_title') }
          subtitle={ t('post_gallery_empty_state_subtitle') }
        />
      }

    </div>
  )
}
