import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import { PostsPaginationQueryParams } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { PostCardOptionConfiguration } from '~/hooks/PostCardOptions'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  PostCardGalleryHeader
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryHeader'

interface PaginationState {
  page: number
  order:PostsPaginationSortingType
}

export interface UserSavedPostsPage {
  userComponentDto: UserProfileHeaderComponentDto
}

export const UserSavedPostsPage: NextPage<UserSavedPostsPage> = ({ userComponentDto }) => {
  const [posts, setPosts] = useState<PostCardComponentDto[]>([])
  const [postsNumber, setPostsNumber] = useState<number>(0)

  const [paginationState, setPaginationState] = useState<PaginationState>({
    order: PostsPaginationSortingType.NEWEST_SAVED,
    page: 1,
  })

  const [loading, setLoading] = useState(false)

  const locale = useRouter().locale ?? 'en'

  useEffect(() => {
    setLoading(true)
    updatePosts(paginationState.page, paginationState.order)
      .then(() => { setLoading(false) })
  }, [])

  const onDeleteSavedPost = (postId: string) => {
    const newPosts = posts.filter((post) => post.id !== postId)

    setPosts(newPosts)
    setPostsNumber(postsNumber - 1)
  }

  const postCardOptions: PostCardOptionConfiguration[] = [
    { type: 'deleteSavedPost', onDelete: onDeleteSavedPost, ownerId: userComponentDto.id },
    { type: 'react' },
  ]

  const sortingOptions: PostsPaginationSortingType[] = [
    PostsPaginationSortingType.NEWEST_SAVED,
    PostsPaginationSortingType.OLDEST_SAVED,
  ]

  const onChangeOption = async (newOrder: PostsPaginationSortingType) => {
    setLoading(true)
    setPaginationState({ ...paginationState, order: PostsPaginationSortingType.NEWEST_SAVED, page: 1 })

    await updatePosts(1, newOrder)

    setLoading(false)
  }

  const updatePosts = async (page:number, order: PostsPaginationSortingType) => {
    const componentOrder = PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(order)

    await new Promise((resolve, reject) => {
      setTimeout(resolve, 3000)
    })

    try {
      const newPosts = await (new PostsApiService())
        .getSavedPosts(
          userComponentDto.id,
          page,
          defaultPerPage,
          componentOrder.criteria,
          componentOrder.option,
          [{ type: PostFilterOptions.SAVED_BY, value: userComponentDto.id }]
        )

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

  const onEndGalleryReach = async () => {
    setLoading(true)
    setPaginationState({ ...paginationState, page: paginationState.page + 1 })
    await updatePosts(paginationState.page + 1, paginationState.order)
    setLoading(false)
  }

  return (
    <div className={ 'flex flex-col gap-y-2 container my-5' }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <PostCardGalleryHeader
        title={ 'asdasd' }
        subtitle={ String(postsNumber) }
        showSortingOptions={ true }
        activeOption={ PostsPaginationSortingType.NEWEST_SAVED }
        sortingOptions={ sortingOptions }
        onClickOption={ onChangeOption }
        loading={ loading }
      />

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
    </div>
  )
}
