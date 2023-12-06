import { NextPage } from 'next'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './UserProfilePage.module.scss'
import {
  UserProfilePostsSectionSelector,
  UserProfilePostsSectionSelectorType, UserProfilePostsSectionSelectorTypes
} from '~/components/pages/UserProfilePage/UserProfilePostsSectionSelector/UserProfilePostsSectionSelector'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PostCardGalleryHeader
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryHeader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import { PostsPaginationQueryParams } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { useTranslation } from 'next-i18next'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import { useSession } from 'next-auth/react'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import {
  UserSavedPostsEmptyState
} from '~/modules/Auth/Infrastructure/Components/UserSavedPostsEmptyState/UserSavedPostsEmptyState'
import { PostCardOptionConfiguration } from '~/hooks/PostCardOptions'

interface PaginationState {
  page: number
  order:PostsPaginationSortingType
  section: UserProfilePostsSectionSelectorType
}

export interface UserProfilePageProps {
  userComponentDto: UserProfileHeaderComponentDto
  section: UserProfilePostsSectionSelectorType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  initialPage: number
  initialOrder: PostsPaginationSortingType
}

export const UserProfilePage: NextPage<UserProfilePageProps> = ({
  userComponentDto,
  section,
  initialPosts,
  initialPostsNumber,
  initialPage,
  initialOrder,
}) => {
  const [posts, setPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const [paginationState, setPaginationState] = useState<PaginationState>({
    order: initialOrder,
    page: initialPage,
    section,
  })
  const [loading, setLoading] = useState(false)

  const { t } = useTranslation('user_profile')
  const { replace, query } = useRouter()
  const { status, data } = useSession()

  const locale = useRouter().locale ?? 'en'

  useEffect(() => {
    let querySection: string

    if (!query.section || Array.isArray(query.section)) {
      querySection = 'savedPosts'
    } else {
      querySection = String(query.section)
    }

    if (UserProfilePostsSectionSelectorTypes.includes(querySection as UserProfilePostsSectionSelectorType)) {
      querySection = querySection as UserProfilePostsSectionSelectorType
    } else {
      querySection = 'savedPosts'

      replace({
        query: {
          username: userComponentDto.username,
          section: 'savedPosts',
        },
      }, undefined, { shallow: true, scroll: false })
    }

    if (paginationState.section !== querySection) {
      setLoading(true)

      let newOrder: PostsPaginationSortingType = PostsPaginationSortingType.NEWEST_SAVED

      if (querySection === 'history') {
        newOrder = PostsPaginationSortingType.NEWEST_VIEWED
      }

      setPaginationState({ section: querySection as UserProfilePostsSectionSelectorType, page: 1, order: newOrder })
      updatePosts(1, newOrder, querySection as UserProfilePostsSectionSelectorType)
        .then(() => {
          setLoading(false)
        })
    }
  }, [query])

  const onDeleteSavedPost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
    setPostsNumber(postsNumber - 1)
  }

  let postCardOptions: PostCardOptionConfiguration[] =
    [{ type: 'deleteSavedPost', onDelete: onDeleteSavedPost, ownerId: userComponentDto.id }, { type: 'react' }]

  if (section === 'history') {
    postCardOptions = [{ type: 'savePost' }, { type: 'react' }]
  }

  const sortingOptions: PostsPaginationSortingType[] = useMemo(() => {
    if (section === 'savedPosts') {
      return [PostsPaginationSortingType.NEWEST_SAVED, PostsPaginationSortingType.OLDEST_SAVED]
    } else {
      return [PostsPaginationSortingType.NEWEST_VIEWED, PostsPaginationSortingType.OLDEST_VIEWED]
    }
  }, [paginationState.section])

  const updatePosts = async (
    page:number,
    order: PostsPaginationSortingType,
    section: UserProfilePostsSectionSelectorType
  ) => {
    const componentOrder = PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(order)

    let fetchPosts = (
      page: number,
      orderCriteria: InfrastructureSortingCriteria,
      orderOption: InfrastructureSortingOptions
    ) => {
      return (new PostsApiService())
        .getSavedPosts(
          String(userComponentDto.id),
          page,
          defaultPerPage,
          orderCriteria,
          orderOption,
          [{ type: PostFilterOptions.SAVED_BY, value: userComponentDto.id }]
        )
    }

    if (section === 'history') {
      fetchPosts = (
        page: number,
        orderCriteria: InfrastructureSortingCriteria,
        orderOption: InfrastructureSortingOptions
      ) => {
        return (new PostsApiService())
          .getUserHistory(
            String(userComponentDto.id),
            page,
            defaultPerPage,
            orderCriteria,
            orderOption,
            []
          )
      }
    }

    try {
      const newPosts = await fetchPosts(page, componentOrder.criteria, componentOrder.option)

      if (page === 1) {
        setPosts(newPosts.posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
        }))
      } else {
        setPosts([
          ...posts,
          ...newPosts.posts.map((post) => {
            return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
          }),
        ])
      }

      setPostsNumber(newPosts.postsNumber)
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  const onSectionChange = async (section: UserProfilePostsSectionSelectorType) => {
    await replace({
      query: {
        username: userComponentDto.username,
        section,
      },
    }, undefined, { shallow: true, scroll: false })
  }

  const onChangeOption = async (newOrder: PostsPaginationSortingType) => {
    setLoading(true)
    let defaultOrder: PostsPaginationSortingType = PostsPaginationSortingType.NEWEST_SAVED

    if (section === 'history') {
      defaultOrder = PostsPaginationSortingType.NEWEST_VIEWED
    }

    /** When change sorting option we move to page 1 **/
    const newQuery = PostsPaginationQueryParams.buildQuery(
      String(1),
      String(1),
      newOrder,
      defaultOrder,
      []
    )

    setPaginationState({ ...paginationState, order: newOrder, page: 1 })

    await replace({
      query: {
        ...newQuery,
        username: userComponentDto.username,
        section: paginationState.section,
      },
    }, undefined, { shallow: true, scroll: false })

    await updatePosts(1, newOrder, paginationState.section)

    setLoading(false)
  }

  const onEndGalleryReach = async () => {
    setLoading(true)
    setPaginationState({ ...paginationState, page: paginationState.page + 1 })
    await updatePosts(paginationState.page + 1, paginationState.order, paginationState.section)
    setLoading(false)
  }

  let galleryTitle = t('user_saved_posts_title')

  if (paginationState.section === 'history') {
    galleryTitle = t('user_history_title')
  }

  let content: ReactElement | null = null

  if (postsNumber > 0) {
    content = (
      <InfiniteScroll
        next={ onEndGalleryReach }
        hasMore={ paginationState.page < PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        loader={ null }
        dataLength={ posts.length }
      >
        <PostCardGallery
          posts={ posts }
          postCardOptions={ postCardOptions }
          loading={ loading }
        />
      </InfiniteScroll>
    )
  }

  if (paginationState.section === 'history' && !loading && postsNumber === 0) {
    content = (
      <EmptyState
        title={ t('history_empty_title') }
        subtitle={ t('history_empty_subtitle') }
      />
    )
  }

  if (paginationState.section === 'savedPosts' && !loading && postsNumber === 0) {
    if (status === 'authenticated' && data && userComponentDto.id === data.user.id) {
      content = <UserSavedPostsEmptyState />
    } else {
      content = (
        <EmptyState
          title={ t('saved_posts_empty_title') }
          subtitle={ t('saved_posts_empty_subtitle') }
        />
      )
    }
  }

  return (
    <div className={ styles.userProfilePage__container }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <UserProfilePostsSectionSelector
        selectedSection={ paginationState.section }
        onClickOption={ onSectionChange }
        disabled={ loading }
      />

      <div className={ styles.userProfilePage__userPosts }>
        <PostCardGalleryHeader
          loading={ loading }
          title={ galleryTitle }
          subtitle={ t('posts_number_title', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
          showSortingOptions={ postsNumber > defaultPerPage }
          activeOption={ paginationState.order }
          sortingOptions={ sortingOptions }
          onChangeOption={ onChangeOption }
        />
        { content }
      </div>
    </div>
  )
}
