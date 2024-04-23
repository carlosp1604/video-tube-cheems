import { FC, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useGetPosts } from '~/hooks/GetPosts'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import useTranslation from 'next-translate/useTranslation'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { EmptyState } from '~/components/EmptyState/EmptyState'

export interface Props {
  actorName: string
  actorSlug: string
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const Actor: FC<Props> = ({
  actorName,
  actorSlug,
  initialPosts,
  initialPostsNumber,
}) => {
  const [page, setPage] = useState<number>(1)
  const [posts, setPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const { loading, getPosts } = useGetPosts()
  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { t } = useTranslation('actors')

  const updatePosts = async (page:number) => {
    try {
      const newPosts = await getPosts(
        page,
        PaginationSortingType.LATEST,
        [{ type: PostFilterOptions.ACTOR_SLUG, value: actorSlug }]
      )

      if (newPosts) {
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
      }
    } catch (exception: unknown) {
      console.error(exception)
    }
  }
  const onEndGalleryReach = async () => {
    const newPage = page + 1

    setPage(newPage)
    await updatePosts(newPage)
  }

  const emptyState = (
    <EmptyState
      title={ t('actor_posts_empty_state_title') }
      subtitle={ t('actor_posts_empty_state_subtitle', { actorName }) }
    />
  )

  return (
    <>
      <CommonGalleryHeader
        title={ 'actors:actor_posts_gallery_title' }
        term={ { title: 'actorName', value: actorName } }
        subtitle={ t('actor_posts_gallery_posts_quantity', { postsNumber }) }
        tag={ 'h2' }
      />

      <InfiniteScroll
        key={ router.asPath }
        next={ onEndGalleryReach }
        hasMore={ page < PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        loader={ null }
        dataLength={ posts.length }
      >
        <PostCardGallery
          posts={ posts }
          postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
          emptyState={ emptyState }
          loading={ loading }
        />
      </InfiniteScroll>
    </>
  )
}
