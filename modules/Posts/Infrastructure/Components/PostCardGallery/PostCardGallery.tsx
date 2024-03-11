import { FC, ReactElement, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardGallery.module.scss'
import { useTranslation } from 'next-i18next'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import {
  PostCardGalleryOptions
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryOptions'
import { PostCardOptionConfiguration, usePostCardOptions } from '~/hooks/PostCardOptions'
import {
  PostCardWithOptions
} from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardWithOptions/PostCardWithOptions'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'
import { Banner } from '~/modules/Shared/Infrastructure/Components/Banner/Banner'
import { DesktopBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/DesktopBanner'

interface Props {
  posts: PostCardComponentDto[]
  postCardOptions: PostCardOptionConfiguration[]
  loading: boolean
  emptyState: ReactElement | null
  showAds: boolean
}

export const PostCardGallery: FC<Partial<Props> & Pick<Props, 'posts' | 'postCardOptions'>> = ({
  posts,
  postCardOptions,
  loading = false,
  emptyState = null,
  showAds = false,
}) => {
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostCard, setSelectedPostCard] = useState<PostCardComponentDto | null>(null)
  const buildOptions = usePostCardOptions()

  const { t } = useTranslation('post_card_gallery')
  const { status } = useSession()

  const postCardGalleryOptions = buildOptions(
    postCardOptions,
    () => setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
  )

  let onClickOptions : ((post: PostCardComponentDto) => void) | undefined

  if (postCardGalleryOptions.length > 0) {
    onClickOptions = (post: PostCardComponentDto) => {
      if (status !== 'authenticated') {
        toast.error(t('user_must_be_authenticated_error_message'))

        return
      }

      setSelectedPostCard(post)
      setPostCardOptionsMenuOpen(true)
    }
  }

  let postsSkeletonNumber

  if (posts.length <= defaultPerPage) {
    postsSkeletonNumber = defaultPerPage - posts.length
  } else {
    postsSkeletonNumber = posts.length % defaultPerPage
  }

  const createSkeletonList = (skeletonNumber: number): ReactElement[] => {
    return Array.from(Array(skeletonNumber).keys())
      .map((index) => (
        <PostCardSkeleton
          key={ index }
          showProducerImage={ true }
          loading={ loading }
        />
      ))
  }

  const skeletonPosts = createSkeletonList(postsSkeletonNumber)

  const postCardWithOptions = posts.map((post) => {
    return (
      <PostCardWithOptions
        post={ post }
        onClickOptions={ () => { if (onClickOptions) { onClickOptions(post) } } }
        showOptionsButton={ !!onClickOptions }
        key={ post.id }
        showProducerImage={ true }
      />
    )
  })

  let content: ReactElement | null = (
    <div className={ `
      ${styles.postCardGallery__container}
      ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
    ` }
    >
      <PostCardGalleryOptions
        options={ postCardGalleryOptions }
        isOpen={ postCardOptionsMenuOpen }
        onClose={ () => setPostCardOptionsMenuOpen(false) }
        selectedPostCard={ selectedPostCard as PostCardComponentDto }
      />
      { postCardWithOptions }
      { loading ? skeletonPosts : null }
    </div>
  )

  // Code depends on defaultPerPage
  if (showAds) {
    let firstPostList : ReactElement[]
    let secondPostList: ReactElement[] = []
    let thirdPostList: ReactElement[] = []
    let firstSkeletonList: ReactElement[] = []
    let secondSkeletonList: ReactElement[] = []
    let thirdSkeletonList: ReactElement[] = []

    if (postCardWithOptions.length < 12) {
      firstPostList = postCardWithOptions
      firstSkeletonList = createSkeletonList(12 - postCardWithOptions.length)
    } else {
      firstPostList = postCardWithOptions.slice(0, 12)

      if (postCardWithOptions.length < 24) {
        secondPostList = postCardWithOptions.slice(12)
        secondSkeletonList = createSkeletonList(24 - postCardWithOptions.length)
      } else {
        secondPostList = postCardWithOptions.slice(12, 24)
        thirdPostList = postCardWithOptions.slice(24)

        if (postCardWithOptions.length < defaultPerPage) {
          thirdSkeletonList = createSkeletonList(defaultPerPage - postCardWithOptions.length)
        }
      }
    }

    let exoClickBanner: ReactElement | null = null

    if (secondPostList.length > 0) {
      exoClickBanner = (<DesktopBanner />)
    }

    content = (
      <>
        <PostCardGalleryOptions
          options={ postCardGalleryOptions }
          isOpen={ postCardOptionsMenuOpen }
          onClose={ () => setPostCardOptionsMenuOpen(false) }
          selectedPostCard={ selectedPostCard as PostCardComponentDto }
        />
        <div className={ `
          ${styles.postCardGallery__container}
          ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
        ` }
        >
          <PostCardGalleryOptions
            options={ postCardGalleryOptions }
            isOpen={ postCardOptionsMenuOpen }
            onClose={ () => setPostCardOptionsMenuOpen(false) }
            selectedPostCard={ selectedPostCard as PostCardComponentDto }
          />
          { firstPostList }
          { loading ? firstSkeletonList : null }
        </div>

        <Banner/>

        <div className={ `
          ${styles.postCardGallery__container}
          ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
        ` }
        >
          <PostCardGalleryOptions
            options={ postCardGalleryOptions }
            isOpen={ postCardOptionsMenuOpen }
            onClose={ () => setPostCardOptionsMenuOpen(false) }
            selectedPostCard={ selectedPostCard as PostCardComponentDto }
          />
          { secondPostList }
          { loading ? secondSkeletonList : null }
        </div>
        { exoClickBanner }
        <div className={ `
          ${styles.postCardGallery__container}
          ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
        ` }
        >
          <PostCardGalleryOptions
            options={ postCardGalleryOptions }
            isOpen={ postCardOptionsMenuOpen }
            onClose={ () => setPostCardOptionsMenuOpen(false) }
            selectedPostCard={ selectedPostCard as PostCardComponentDto }
          />
          { thirdPostList }
          { loading ? thirdSkeletonList : null }
        </div>
      </>)
  }

  if (posts.length === 0 && !loading) {
    content = emptyState
  }

  return content
}
