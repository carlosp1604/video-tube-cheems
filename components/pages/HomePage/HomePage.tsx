import { NextPage } from 'next'
import { calculatePagesNumber, defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { HomePagePaginationOrderType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
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
import { PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import { PostsPaginationOrderType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationOrderType'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { ParsedUrlQuery } from 'querystring'

export interface Props {
  page: number
  order: PostsPaginationOrderType
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

  const scrollToTop = () => { window.scrollTo({ behavior: 'smooth', top: 0 }) }

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
        onChangeProducer={ async (producer) => {
          const newQuery: ParsedUrlQuery = {}

          if (producer.slug !== allPostsProducerDto.slug) {
            newQuery.producerSlug = producer.slug
          }

          await router.push({
            pathname,
            query: { ...newQuery },
          }, undefined, { shallow: false, scroll: false })
        } }
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
            sortingOptions={ HomePagePaginationOrderType }
            onChangeOption={ async (newOption) => {
              const newQuery: ParsedUrlQuery = {}

              if (activeProducer && activeProducer.slug !== allPostsProducerDto.slug) {
                newQuery.producerSlug = activeProducer.slug
              }

              if (newOption !== PostsPaginationOrderType.LATEST) {
                newQuery.order = newOption
              }

              await router.push({
                pathname,
                query: { ...newQuery },
              }, undefined, { shallow: false, scroll: false })
            } }
          />

          <PostCardGallery
            posts={ posts }
            postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
          />

          <PaginationBar
            availablePages={ PaginationHelper.getShowablePages(
              page,
              calculatePagesNumber(postsNumber, defaultPerPage)
            ) }
            onPageNumberChange={ async (pageNumber) => {
              const newQuery: ParsedUrlQuery = {}

              if (activeProducer && activeProducer.slug !== allPostsProducerDto.slug) {
                newQuery.producerSlug = activeProducer.slug
              }

              if (order !== PostsPaginationOrderType.LATEST) {
                newQuery.order = order
              }

              if (pageNumber !== 1) {
                newQuery.page = String(pageNumber)
              }

              await router.push({
                pathname,
                query: { ...newQuery },
              }, undefined, { shallow: false, scroll: true })
            } }
            pageNumber={ page }
            pagesNumber={ calculatePagesNumber(postsNumber, defaultPerPage) }
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
