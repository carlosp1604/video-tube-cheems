import dynamic from 'next/dynamic'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { FC, ReactElement } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  CommonGalleryHeader, HeaderTag,
  TitleTerm
} from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { PostCardOptionConfiguration } from '~/hooks/PostCardOptions'

const PaginationBar = dynamic(() =>
  import('~/components/PaginationBar/PaginationBar').then((module) => module.PaginationBar)
)

const SortingMenuDropdown = dynamic(() =>
  import('~/components/SortingMenuDropdown/SortingMenuDropdown').then((module) => module.SortingMenuDropdown),
{ ssr: false })

export interface Props {
  title: string
  term: TitleTerm | undefined
  headerTag: HeaderTag
  subtitle: string
  page: number
  order: PostsPaginationSortingType
  posts: PostCardComponentDto[]
  postsNumber: number
  sortingOptions: PostsPaginationSortingType[]
  emptyState: ReactElement
  paginatedPostCardGalleryPostCardOptions: PostCardOptionConfiguration[]
}

export const PaginatedPostCardGallerySSR: FC<Partial<Props> & Omit<Props, 'term'>> = ({
  title,
  headerTag,
  subtitle,
  postsNumber,
  posts,
  page,
  order,
  sortingOptions,
  emptyState,
  paginatedPostCardGalleryPostCardOptions,
  term = undefined,
}) => {
  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: false,
    scrollOnClick: true,
  }

  return (
    <>
      <CommonGalleryHeader
        title={ title }
        subtitle={ subtitle }
        loading={ false }
        sortingMenu={
          <SortingMenuDropdown
            activeOption={ order }
            options={ sortingOptions }
            loading={ false }
            visible={ postsNumber > defaultPerPage }
            linkMode={ linkMode }
            onClickOption={ undefined }
          />
        }
        tag={ headerTag }
        term={ term }
      />

      <PostCardGallery
        posts={ posts }
        loading={ false }
        emptyState={ emptyState }
        postCardOptions={ paginatedPostCardGalleryPostCardOptions }
        showAds={ true }
      />

      <PaginationBar
        pageNumber={ page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        linkMode={ linkMode }
        onPageChange={ undefined }
      />
    </>
  )
}
