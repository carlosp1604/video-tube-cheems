import { useRouter } from 'next/router'
import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { calculatePagesNumber } from '~/modules/Shared/Infrastructure/Pagination'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import styles from './PaginatedPostCardGallery.module.scss'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import {
  SortingOption
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { useTranslation } from 'next-i18next'
import { BsDot } from 'react-icons/bs'
// eslint-disable-next-line max-len
import {
  PostCardGallery,
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { useQueryState } from 'next-usequerystate'
import { parseAsInteger } from 'next-usequerystate/parsers'
import { useUpdateQuery } from '~/hooks/QueryState'
import { useFirstRender } from '~/hooks/FirstRender'

interface Props {
  title: string
  initialPage: number
  perPage: number
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  filters: FetchPostsFilter[]
  sortingOptions: SortingOption[]
  defaultSortingOption: SortingOption
  postCardOptions: PostCardGalleryOption[]
  fetchPosts: (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) =>
    Promise<GetPostsApplicationResponse>
  emptyState: ReactElement | null
}

export const PaginatedPostCardGallery: FC<Props> = ({
  title,
  initialPage,
  perPage,
  initialPosts,
  initialPostsNumber,
  filters,
  sortingOptions,
  defaultSortingOption,
  postCardOptions,
  fetchPosts,
  emptyState,
}) => {
  const [page, setPage] = useState<number>(initialPage)
  const [pagesNumber, setPagesNumber] = useState<number>(calculatePagesNumber(initialPostsNumber, perPage))
  const [currentPosts, setCurrentPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [activeSortingOption, setActiveSortingOption] = useState<SortingOption>(defaultSortingOption)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)
  const [availablePages, setAvailablePages] =
    useState<Array<number>>(PaginationHelper.getShowablePages(initialPage, pagesNumber))
  const [pageQueryParam] = useQueryState('page', parseAsInteger.withDefault(1))
  const updateQuery = useUpdateQuery()
  const firstRender = useFirstRender()

  const postGalleryRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('paginated_post_card_gallery')

  const router = useRouter()
  const locale = router.locale ?? 'en'

  useEffect(() => {
    if (firstRender) {
      return
    }

    if (page !== pageQueryParam) {
      updatePosts(pageQueryParam, activeSortingOption, filters)
      setPage(pageQueryParam)
    }
  }, [pageQueryParam])

  const updatePosts = async (page: number, sortingOption: SortingOption, postsFilters: FetchPostsFilter[]) => {
    const posts = await fetchPosts(page, sortingOption, postsFilters)

    setCurrentPosts(posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    }))

    const newPagesNumber = calculatePagesNumber(posts.postsNumber, perPage)

    setPostsNumber(posts.postsNumber)
    setAvailablePages(PaginationHelper.getShowablePages(page, newPagesNumber))
    setPagesNumber(newPagesNumber)
  }

  const scrollToTop = () => {
    postGalleryRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const onDeletePost = async (postId: string) => {
    const newPostsNumber = postsNumber - 1

    setCurrentPosts(currentPosts.filter((post) => post.id !== postId))
    setPostsNumber(postsNumber - 1)

    if (initialPage > 1 && newPostsNumber % perPage === 0) {
      const newPageNumber = initialPage - 1

      setPage(newPageNumber)
      await updateQuery([{ key: 'page', value: String(newPageNumber) }])
      setPagesNumber(pagesNumber - 1)
      await updatePosts(newPageNumber, activeSortingOption, filters)
    }
  }

  let sortingOptionsElement: ReactElement | null = null

  if (postsNumber > perPage) {
    sortingOptionsElement = (
      <SortingMenuDropdown
        activeOption={ activeSortingOption }
        onChangeOption={ async (option: SortingOption) => {
          setActiveSortingOption(option)
          await updatePosts(initialPage, option, filters)
          scrollToTop()
        } }
        options={ sortingOptions }
      />
    )
  }

  return (
    <div
      className={ styles.paginatedPostCardGallery__container }
      ref={ postGalleryRef }
    >
      <div className={ styles.paginatedPostCardGallery__header }>
        <span className={ styles.paginatedPostCardGallery__title }>
          { title }
          <BsDot className={ styles.paginatedPostCardGallery__separatorIcon }/>
          <small className={ styles.paginatedPostCardGallery__videosQuantity }>
            { t('gallery_posts_count_title', { videosNumber: postsNumber }) }
          </small>
        </span>

        { sortingOptionsElement }
      </div>

      { postsNumber === 0 ? emptyState : null }

      <PostCardGallery
        posts={ currentPosts }
        postCardOptions={ postCardOptions }
        onClickDeleteOption={ onDeletePost }
      />

      <PaginationBar
        availablePages={ availablePages }
        pageNumber={ page }
        onPageNumberChange={ async (newPageNumber) => {
          await updatePosts(newPageNumber, activeSortingOption, filters)
          setPage(newPageNumber)
          await updateQuery([{ key: 'page', value: String(newPageNumber) }])
          scrollToTop()
        } }
        pagesNumber={ pagesNumber }
      />
    </div>
  )
}
