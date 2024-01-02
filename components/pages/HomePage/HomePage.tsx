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
  const { asPath } = router
  const locale = router.locale ?? 'en'

  let galleryTitle: string

  if (!activeProducer) {
    galleryTitle = t('post_gallery_no_producer_title')
  } else {
    galleryTitle = activeProducer.id === '' ? t('all_producers_title', { ns: 'home_page' }) : activeProducer.name
  }

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        activeProducer={ activeProducer }
      />

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
      />

      { postsNumber > 0
        ? <PostCardGallery
          posts={ posts }
          postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        />
        : <EmptyState
          title={ t('post_gallery_empty_state_title') }
          subtitle={ t('post_gallery_empty_state_subtitle') }
        />
      }

      <PaginationBar
        availablePages={ PaginationHelper.getShowablePages(
          page, PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage)) }
        pageNumber={ page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        shallowNavigation={ false }
      />
    </div>
  )
}
