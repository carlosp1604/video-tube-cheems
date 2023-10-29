import { useRouter } from 'next/router'
import { FC, ReactElement, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { calculatePagesNumber, defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
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
import { useFirstRender } from '~/hooks/FirstRender'
import { useTranslation } from 'next-i18next'
import { BsDot, BsThreeDotsVertical } from 'react-icons/bs'
import toast from 'react-hot-toast'
// eslint-disable-next-line max-len
import {
  PaginatedPostCardGalleryOption,
  PaginatedPostCardGalleryOptions
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGalleryOptions/PaginatedPostCardGalleryOptions'
import { useSession } from 'next-auth/react'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'
import * as uuid from 'uuid'
import { Tooltip } from 'react-tooltip'

export enum PostCardGalleryAction {
  DELETE = 'delete',
  NO_MUTATE = 'no-mutate'
}

export interface PostCardGalleryOption {
  title: string
  icon: ReactElement
  action: PostCardGalleryAction
  onClick: (postId: string) => void
}

interface Props {
  title: string
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  filters: FetchPostsFilter[]
  sortingOptions: SortingOption[]
  defaultSortingOption: SortingOption
  postCardOptions: PostCardGalleryOption[]
  fetchPosts: (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) =>
    Promise<GetPostsApplicationResponse>
}

export const PaginatedPostCardGallery: FC<Props> = ({
  title,
  initialPosts,
  initialPostsNumber,
  filters,
  sortingOptions,
  defaultSortingOption,
  postCardOptions,
  fetchPosts,
}) => {
  const [pagesNumber, setPagesNumber] = useState<number>(calculatePagesNumber(initialPostsNumber, defaultPerPage))
  const [pageNumber, setPageNumber] = useState(1)
  const [currentPosts, setCurrentPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [activeSortingOption, setActiveSortingOption] = useState<SortingOption>(defaultSortingOption)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostId, setSelectedPostId] = useState<string>('')

  // TODO: If component translation keys grows up then create a specific translations file
  const { t } = useTranslation('paginated_post_card_gallery')

  const firstRender = useFirstRender()

  const router = useRouter()
  const locale = router.locale ?? 'en'
  const { status } = useSession()
  const tooltipUuid = uuid.v4()

  const updatePosts = async () => {
    const posts = await fetchPosts(pageNumber, activeSortingOption, filters)

    setCurrentPosts(posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
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

  let paginationBar = null

  if (postsNumber > 0 && postsNumber > defaultPerPage) {
    paginationBar = (
      <PaginationBar
        pageNumber={ pageNumber }
        setPageNumber={ setPageNumber }
        pagesNumber={ pagesNumber }
      />
    )
  }

  let onClickOptions : ((postId: string) => void) | undefined

  if (postCardOptions.length > 0) {
    onClickOptions = (postId: string) => {
      if (status !== 'authenticated') {
        toast.error(t('user_must_be_authenticated_error_message'))

        return
      }

      setSelectedPostId(postId)
      setPostCardOptionsMenuOpen(true)
    }
  }

  const buildOption = (option: PostCardGalleryOption): PaginatedPostCardGalleryOption => {
    switch (option.action) {
      case PostCardGalleryAction.NO_MUTATE: {
        const action = async () => {
          try {
            await option.onClick(selectedPostId)
            setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
          } catch (exception: unknown) {
            // Action failed -> NO ACTION TAKEN
            console.error(exception)
          }
        }

        return {
          title: option.title,
          onClick: action,
          icon: option.icon,
        }
      }

      case PostCardGalleryAction.DELETE: {
        const action = async () => {
          try {
            await option.onClick(selectedPostId)
            setCurrentPosts(currentPosts.filter((post) => post.id !== selectedPostId))
            setPostsNumber(postsNumber - 1)
            setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
          } catch (exception: unknown) {
            // Action failed -> NO ACTION TAKEN
            console.error(exception)
          }
        }

        return {
          title: option.title,
          onClick: action,
          icon: option.icon,
        }
      }

      default:
        toast.error(t('action_does_not_exist_error_message'))

        throw Error(t('action_does_not_exist_error_message'))
    }
  }

  return (
    <div className={ styles.paginatedPostCardGallery__container }>
      <div className={ styles.paginatedPostCardGallery__header }>
        <h1 className={ styles.paginatedPostCardGallery__title }>
          { title }
          <BsDot className={ styles.paginatedPostCardGallery__separatorIcon }/>
          <small className={ styles.paginatedPostCardGallery__videosQuantity }>
            { t('gallery_posts_count_title', { videosNumber: postsNumber }) }
          </small>
        </h1>

        <SortingMenuDropdown
          activeOption={ activeSortingOption }
          onChangeOption={ (option: SortingOption) => setActiveSortingOption(option) }
          options={ sortingOptions }
        />
      </div>

      <PaginatedPostCardGalleryOptions
        options={ postCardOptions.map((action) => buildOption(action)) }
        isOpen={ postCardOptionsMenuOpen }
        onClose={ () => setPostCardOptionsMenuOpen(false) }
      />

      <div className={ styles.paginatedPostCardGallery__postCardListContainer }>
        { currentPosts.map((post) => {
          return (
            <div
              className={ styles.paginatedPostCardGallery__postCardContainer }
              key={ post.id }
            >
              <PostCard
                showProducerImage={ true }
                post={ post }
              />
              <button className={ `
                ${styles.paginatedPostCardGallery__postOptions}
                ${onClickOptions ? styles.paginatedPostCardGallery__postOptions_visible : ''}
              ` }
                onClick={ () => { if (onClickOptions) { onClickOptions(post.id) } } }
                data-tooltip-id={ tooltipUuid }
                data-tooltip-content={ t('post_card_options_button_title') }
              >
                <BsThreeDotsVertical/>
                <Tooltip id={ tooltipUuid }/>
              </button>
            </div>
          )
        }) }
      </div>

      { paginationBar }
    </div>
  )
}
