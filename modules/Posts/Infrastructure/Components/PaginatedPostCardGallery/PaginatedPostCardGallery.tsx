import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { calculatePagesNumber } from '~/modules/Shared/Infrastructure/Pagination'
import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDto'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import styles from './PaginatedPostCardGallery.module.scss'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { PostCardList } from '~/modules/Posts/Infrastructure/Components/PostCardList/PostCardList'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import {
  defaultSortingOption,
  SortingOption,
  sortingOptions
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { useFirstRender } from '~/hooks/FirstRender'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { useTranslation } from 'next-i18next'

interface Props {
  title: string
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  filters: FetchPostsFilter[]
}

export const PaginatedPostCardGallery: FC<Props> = ({
  title,
  initialPosts,
  initialPostsNumber,
  filters,
}) => {
  const [pagesNumber, setPagesNumber] = useState<number>(calculatePagesNumber(initialPostsNumber, defaultPerPage))
  const [pageNumber, setPageNumber] = useState(1)
  const [currentPosts, setCurrentPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [playerId, setPlayerId] = useState<string>('')
  const [activeSortingOption, setActiveSortingOption] = useState<SortingOption>(defaultSortingOption)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  // TODO: If component translation keys grows up then create a specific translations file
  const { t } = useTranslation('common')

  const apiService = new PostsApiService()

  const firstRender = useFirstRender()

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const fetchPosts = async (): Promise<GetPostsApplicationResponse> => {
    return apiService.getPosts(
      pageNumber,
      defaultPerPage,
      activeSortingOption.criteria,
      activeSortingOption.option,
      filters
    )
  }

  const updatePosts = async () => {
    const posts = await fetchPosts()

    setCurrentPosts(posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(
        post.post,
        post.postReactions,
        post.postComments,
        post.postViews,
        locale)
    }))
    setPostsNumber(posts.postsNumber)
    setPagesNumber(calculatePagesNumber(posts.postsNumber, defaultPerPage))
  }

  useEffect(() => {
    if (firstRender) {
      return
    }

    if (pageNumber === 1) {
      updatePosts().then(() => {
        scrollToTop()
      })

      return
    }

    setPageNumber(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), activeSortingOption])

  useEffect(() => {
    if (firstRender) {
      return
    }

    updatePosts().then(() => {
      scrollToTop()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className={ styles.paginatedPostCardGallery__container }>
      <div className={ styles.paginatedPostCardGallery__header }>
        <h1 className={ styles.paginatedPostCardGallery__title }>
          { title }
          <small className={ styles.paginatedPostCardGallery__videosQuantity }>
            { t('paginated_gallery_videos_count_title', { videosNumber: postsNumber }) }
          </small>
        </h1>

        <SortingMenuDropdown
          activeOption={ activeSortingOption }
          onChangeOption={ (option: SortingOption) => setActiveSortingOption(option) }
          options={ sortingOptions }
        />
      </div>

      <PostCardList
        posts={ currentPosts }
        playerId={ playerId }
        setPlayerId={ setPlayerId }
      />

      <PaginationBar
        pageNumber={ pageNumber }
        setPageNumber={ setPageNumber }
        pagesNumber={ pagesNumber }
      />
    </div>
  )
}
