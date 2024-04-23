import { FC, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useRouter } from 'next/router'
import { useGetPosts } from '~/hooks/GetPosts'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import useTranslation from 'next-translate/useTranslation'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationQueryParams'
import { useFirstRender } from '~/hooks/FirstRender'
import { TagPageComponentDto } from '~/modules/PostTag/Infrastructure/TagPageComponentDto'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'

interface TagPagePaginationState {
  page: number
  order: PostsPaginationSortingType
}

export interface Props {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  tag: TagPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const Tag: FC<Props> = ({
  initialPage,
  initialOrder,
  tag,
  initialPosts,
  initialPostsNumber,
}) => {
  const [posts, setPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const [pagination, setPagination] = useState<TagPagePaginationState>({ page: initialPage, order: initialOrder })

  const { loading, getPosts } = useGetPosts()
  const firstRender = useFirstRender()
  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { t } = useTranslation('tag_page')

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: true,
    scrollOnClick: true,
  }

  const configuration: Partial<PostsPaginationConfiguration> &
    Pick<PostsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
      page: {
        defaultValue: 1,
        maxValue: Infinity,
        minValue: 1,
      },
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: sortingOptions,
      },
    }

  useEffect(() => {
    if (firstRender) {
      return
    }

    const queryParams = new PostsPaginationQueryParams(router.query, configuration)

    const newPage = queryParams.page ?? configuration.page.defaultValue
    const newOrder = queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue

    if (newPage === pagination.page && newOrder === pagination.order) {
      return
    }

    setPagination({ page: newPage, order: newOrder })

    updatePosts(newPage, newOrder)
  }, [router.query])

  const updatePosts = async (page:number, order: PostsPaginationSortingType) => {
    try {
      const newPosts = await getPosts(
        page,
        order,
        [{ type: PostFilterOptions.TAG_SLUG, value: tag.slug }]
      )

      if (newPosts) {
        setPosts(newPosts.posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
        }))

        setPostsNumber(newPosts.postsNumber)
      }
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  const emptyState = (
    <EmptyState
      title={ t('tag_posts_empty_state_title') }
      subtitle={ t('tag_posts_empty_state_subtitle', { tagName: tag.name }) }
    />
  )

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ pagination.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ postsNumber > defaultPerPage }
      linkMode={ linkMode }
    />
  )

  return (
    <>
      <CommonGalleryHeader
        title={ 'tag_page:tag_posts_gallery_title' }
        subtitle={ t('tag_posts_gallery_posts_quantity', { postsNumber }) }
        term={ { title: 'tagName', value: tag.name } }
        loading={ loading }
        tag={ 'h2' }
        sortingMenu={ sortingMenu }
      />

      <PostCardGallery
        posts={ posts }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        loading={ loading }
        emptyState={ emptyState }
        showAds={ true }
      />

      <PaginationBar
        key={ router.asPath }
        pageNumber={ pagination.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        linkMode={ { ...linkMode, scrollOnClick: false } }
        onPageChange={ () => window.scrollTo({ top: 0 }) }
        disabled={ loading }
      />
    </>
  )
}
