import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardGallery.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { useSession } from 'next-auth/react'
import { PostCardOptionConfiguration, usePostCardOptions } from '~/hooks/PostCardOptions'
import {
  PostCardWithOptions
} from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardWithOptions/PostCardWithOptions'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'
import dynamic from 'next/dynamic'
import { PostCardGalleryAdsPreset } from '~/modules/Posts/Infrastructure/Frontend/PostCardGalleryAdsPreset'
import { PaginatedPostCardGalleryHelper } from '~/modules/Posts/Infrastructure/Frontend/PaginatedPostCardGalleryHelpter'
import { PostCardAdvertising } from '~/modules/Shared/Infrastructure/Components/Advertising/PostCardAdvertising'
import { useToast } from '~/components/AppToast/ToastContext'
import { adsData } from '~/adsData'
import {
  ExoclickResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Exoclick/ExoclickResponsiveBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'

const PostCardGalleryOptions = dynamic(() => import(
  '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryOptions'
).then((module) => module.PostCardGalleryOptions), { ssr: false }
)

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
  const [mounted, setMounted] = useState<boolean>(false)
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostCard, setSelectedPostCard] = useState<PostCardComponentDto | null>(null)
  const buildOptions = usePostCardOptions()

  const { t } = useTranslation('post_card_gallery')
  const { status } = useSession()
  const { error } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const postCardGalleryOptions = buildOptions(
    postCardOptions,
    () => setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
  )

  let onClickOptions : ((post: PostCardComponentDto) => void) | undefined

  if (postCardGalleryOptions.length > 0) {
    onClickOptions = async (post: PostCardComponentDto) => {
      if (status !== 'authenticated') {
        error(t('user_must_be_authenticated_error_message'))

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
          loading={ loading }
        />
      ))
  }

  const skeletonPosts = createSkeletonList(postsSkeletonNumber)

  const postCards = useMemo(() => {
    const postCards = posts.map((post) => {
      return (
        <PostCardWithOptions
          post={ post }
          onClickOptions={ () => { if (onClickOptions) { onClickOptions(post) } } }
          showOptionsButton={ !!onClickOptions }
          key={ post.id }
        />
      )
    })

    if (showAds && postCards.length > 0) {
      const firstCardViews = posts[0].views
      const firstCardDate = posts[0].date

      const indexes: Array<number> = []

      for (let i = 0; i < PostCardGalleryAdsPreset.length; i++) {
        const adPosition = PostCardGalleryAdsPreset[i]

        if (adPosition > (postCards.length + 1)) {
          break
        }

        if (mounted) {
          const adIndex = PaginatedPostCardGalleryHelper.genRandomValue(0, adsData.length - 1, indexes)

          indexes.push(adIndex)

          postCards.splice(adPosition, 0, (
            <PostCardAdvertising
              key={ adsData[adIndex].offerUrl }
              offerUrl={ adsData[adIndex].offerUrl }
              thumb={ PaginatedPostCardGalleryHelper.getRandomElementFromArray(adsData[adIndex].thumbs) }
              title={ t(`advertising:${adsData[adIndex].titleKey}`) }
              adNetworkName={ adsData[adIndex].adNetworkName }
              views={ firstCardViews }
              date={ firstCardDate }
            />
          ))
        } else {
          postCards.splice(adPosition, 0, (
            <PostCardSkeleton loading={ true } key={ adPosition }/>
          ))
        }
      }
    }

    return postCards
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, mounted])

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
      { postCards }
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

    if (postCards.length < 12) {
      firstPostList = postCards
      firstSkeletonList = createSkeletonList(12 - postCards.length)
    } else {
      firstPostList = postCards.slice(0, 12)

      if (postCards.length < 24) {
        secondPostList = postCards.slice(12)
        secondSkeletonList = createSkeletonList(24 - postCards.length)
      } else {
        secondPostList = postCards.slice(12, 24)
        thirdPostList = postCards.slice(24)

        if (postCards.length < defaultPerPage) {
          thirdSkeletonList = createSkeletonList(defaultPerPage - postCards.length)
        }
      }
    }

    let exoClickBanner: ReactElement | null = null

    if (secondPostList.length > 0) {
      exoClickBanner = (<ExoclickResponsiveBanner />)
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
          { firstPostList }
          { loading ? firstSkeletonList : null }
        </div>

        <AdsterraResponsiveBanner />

        <div className={ `
          ${styles.postCardGallery__container}
          ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
        ` }
        >
          { secondPostList }
          { loading ? secondSkeletonList : null }
        </div>

        { exoClickBanner }

        <div className={ `
          ${styles.postCardGallery__container}
          ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
        ` }
        >
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
