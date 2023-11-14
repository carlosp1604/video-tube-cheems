import { useRouter } from 'next/router'
import { FC, ReactElement, useRef, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { calculatePagesNumber } from '~/modules/Shared/Infrastructure/Pagination'
import styles from './PaginatedPostCardGallery.module.scss'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { useTranslation } from 'next-i18next'
import { BsDot } from 'react-icons/bs'
// eslint-disable-next-line max-len
import {
  PostCardGallery,
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { useUpdateQuery } from '~/hooks/UpdateQuery'
import {
  PostsPaginationOrderType
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { useFirstRender } from '~/hooks/FirstRender'

interface Props {
  title: string
  initialPage: number
  perPage: number
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  filters: FetchPostsFilter[]
  sortingOptions: PostsPaginationOrderType[]
  initialSortingOption: PostsPaginationOrderType
  defaultSortingOption: PostsPaginationOrderType
  postCardOptions: PostCardGalleryOption[]
  // fetchPosts: (pageNumber: number, sortingOption: ComponentSortingOption, filters: FetchPostsFilter[]) =>
    // Promise<GetPostsApplicationResponse>
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
  initialSortingOption,
  defaultSortingOption,
  postCardOptions,
  // fetchPosts,
  emptyState,
}) => {
  const [page, setPage] = useState<number>(initialPage)
  const [pagesNumber, setPagesNumber] = useState<number>(calculatePagesNumber(initialPostsNumber, perPage))
  // const [currentPosts, setCurrentPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [activeSortingOption, setActiveSortingOption] = useState<PostsPaginationOrderType>(initialSortingOption)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  // const [availablePages, setAvailablePages] =
  useState<Array<number>>(PaginationHelper.getShowablePages(page, pagesNumber))
  // const [pageQueryParam] = useQueryState('page', parseAsInteger.withDefault(1))
  // const [orderQueryParam] = useQueryState('order', parseAsString.withDefault(defaultSortingOption))

  const updateQuery = useUpdateQuery()
  const firstRender = useFirstRender()

  const postGalleryRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('paginated_post_card_gallery')

  const router = useRouter()
  const locale = router.locale ?? 'en'

  /**
   useEffect(() => {
   if (firstRender) {
   return
   }

   setPage(pageQueryParam)
   setActiveSortingOption(orderQueryParam as PostsPaginationOrderType)
   }, [router.query])

   */

  /**
  const updatePosts = async (
    page: number,
    sortingOption: PostsPaginationOrderType,
    postsFilters: FetchPostsFilter[],
    scroll: boolean
  ) => {
    const componentSortingOption = PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(sortingOption)
    const posts = await fetchPosts(page, componentSortingOption, postsFilters)

    setCurrentPosts(posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    }))

    const newPagesNumber = calculatePagesNumber(posts.postsNumber, perPage)

    setPage(page)
    setActiveSortingOption(sortingOption)
    setPostsNumber(posts.postsNumber)
    setAvailablePages(PaginationHelper.getShowablePages(page, newPagesNumber))
    setPagesNumber(newPagesNumber)
    if (scroll) {
      scrollToTop()
    }
  }
    **/

  // const scrollToTop = () => { postGalleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  const onDeletePost = async (postId: string) => {
    const newPostsNumber = postsNumber - 1

    // setCurrentPosts(initialPosts.filter((post) => post.id !== postId))
    // setPostsNumber(postsNumber - 1)

    if (page > 1 && newPostsNumber % perPage === 0) {
      const newPageNumber = -1

      setPage(newPageNumber)
      setPagesNumber(pagesNumber - 1)
      // await updatePosts(newPageNumber, activeSortingOption, filters, false)
      await updateQuery([{ key: 'page', value: String(newPageNumber) }])
    }
  }

  let sortingOptionsElement: ReactElement | null = null

  if (postsNumber > perPage) {
    sortingOptionsElement = (
      <SortingMenuDropdown
        activeOption={ activeSortingOption }
        options={ sortingOptions }
        onChangeOption={ async (option: PostsPaginationOrderType) => {
          await updateQuery([
            { key: 'order', value: String(option) },
            { key: 'page', value: '1' },
          ])

          setActiveSortingOption(option)
          setPage(1)
          // await updatePosts(1, option, filters, true)
        } }
      />
    )
  }

  return (
    <div className={ styles.paginatedPostCardGallery__container }>
      <div className={ styles.paginatedPostCardGallery__header }>
        <span className={ styles.paginatedPostCardGallery__title }>
          { title }
          <BsDot className={ styles.paginatedPostCardGallery__separatorIcon }/>
          <small className={ styles.paginatedPostCardGallery__videosQuantity }>
            { t('gallery_posts_count_title', { videosNumber: initialPostsNumber }) }
          </small>
        </span>

        { sortingOptionsElement }
      </div>

      { postsNumber === 0 ? emptyState : null }

      <PostCardGallery
        posts={ initialPosts }
        postCardOptions={ postCardOptions }
        onClickDeleteOption={ onDeletePost }
      />

      <PaginationBar
        availablePages={ PaginationHelper.getShowablePages(page, pagesNumber) }
        pageNumber={ page }
        onPageNumberChange={ async (newPageNumber) => {
          await updateQuery([{ key: 'page', value: String(newPageNumber) }])
          setPage(newPageNumber)
        } }
        pagesNumber={ pagesNumber }
      />
    </div>
  )
}
