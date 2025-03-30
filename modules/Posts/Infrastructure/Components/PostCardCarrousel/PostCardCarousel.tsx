import { FC, useState } from 'react'
import { Carousel } from '~/components/Carousel/Carousel'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCardOptionConfiguration, usePostCardOptions } from '~/hooks/PostCardOptions'
import {
  PostCardWithOptions
} from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardWithOptions/PostCardWithOptions'
import useTranslation from 'next-translate/useTranslation'
import { useSession } from 'next-auth/react'
import {
  PostCardGalleryOptions
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryOptions'
import { useToast } from '~/components/AppToast/ToastContext'
import { PostCardOptionalProps } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'
import { MediaQueryBreakPoints, useMediaQuery } from '~/hooks/MediaQuery'

interface Props {
  posts: PostCardComponentDto[]
  postCardOptions: PostCardOptionConfiguration[]
  preloadImages: boolean
}

export const PostCardCarousel: FC<Props & Partial<PostCardOptionalProps>> = ({
  posts,
  postCardOptions,
  preloadImages,
  showExtraData = true,
  showData = true,
}) => {
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostCard, setSelectedPostCard] = useState<PostCardComponentDto | null>(null)
  const buildOptions = usePostCardOptions()
  const activeBreakpoint = useMediaQuery()

  const { t } = useTranslation('post_card_gallery')
  const { status } = useSession()
  const { error } = useToast()

  const postCardGalleryOptions = buildOptions(
    postCardOptions,
    () => setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
  )

  let onClickOptions : ((postCard: PostCardComponentDto) => void) | undefined

  if (postCardGalleryOptions.length > 0) {
    onClickOptions = (postCard: PostCardComponentDto) => {
      if (status !== 'authenticated') {
        error(t('user_must_be_authenticated_error_message'))

        return
      }

      setSelectedPostCard(postCard)
      setPostCardOptionsMenuOpen(true)
    }
  }

  let imagesToPreload = 2

  if (activeBreakpoint === MediaQueryBreakPoints.TB) {
    imagesToPreload = 3
  }

  if (activeBreakpoint > MediaQueryBreakPoints.TB) {
    imagesToPreload = 4
  }

  return (
    <>
      <PostCardGalleryOptions
        options={ postCardGalleryOptions }
        isOpen={ postCardOptionsMenuOpen }
        onClose={ () => setPostCardOptionsMenuOpen(false) }
        selectedPostCard={ selectedPostCard as PostCardComponentDto }
      />
      <Carousel
        onEndReached={ undefined }
        itemsAutoWidth={ false }
        showButtons={ true }
      >
        { posts.map((post, index) => {
          return ({
            key: post.id,
            component:
              <PostCardWithOptions
                post={ post }
                onClickOptions={ () => {
                  if (onClickOptions) {
                    onClickOptions(post)
                  }
                } }
                showOptionsButton={ !!onClickOptions }
                key={ post.id }
                showData={ showData }
                showExtraData={ showExtraData }
                preloadImage={ (index < imagesToPreload) && preloadImages }
              />,
          })
        }) }
      </Carousel>
    </>
  )
}
