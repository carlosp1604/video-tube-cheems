import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import styles from './UserProfile.module.scss'
import { useRouter } from 'next/router'
import { FC, ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostCardCarousel } from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarousel'
import Link from 'next/link'
import {
  PostCardCarouselSkeleton
} from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarouselSkeleton'
import {
  UserSavedPostsEmptyState
} from '~/modules/Auth/Infrastructure/Components/UserSavedPostsEmptyState/UserSavedPostsEmptyState'
import { useSession } from 'next-auth/react'

export interface Props {
  userComponentDto: UserProfileHeaderComponentDto
}

export const UserProfile: FC<Props> = ({ userComponentDto }) => {
  const [loading, setLoading] = useState(false)

  const [postsHistory, setPostsHistory] = useState<PostCardComponentDto[]>([])
  const [savedPosts, setSavedPosts] = useState<PostCardComponentDto[]>([])
  const [postsHistoryNumber, setPostsHistoryNumber] = useState<number>(0)
  const [savedPostsNumber, setSavedPostsNumber] = useState<number>(0)

  const { t } = useTranslation('user_profile')
  const { status, data } = useSession()

  const locale = useRouter().locale ?? 'en'

  const onDeleteSavedPost = async (postId: string) => {
    const newSavedPosts = savedPosts.filter((savedPost) => savedPost.id !== postId)

    let newPostsNumber = savedPostsNumber

    if (newSavedPosts.length < savedPosts.length) {
      newPostsNumber = savedPostsNumber - 1
    }

    if (
      newPostsNumber > newSavedPosts.length &&
      newSavedPosts.length <= (defaultPerPage / 2)
    ) {
      setLoading(true)
      await fetchSavedPosts()
      setLoading(false)
    } else {
      setSavedPostsNumber(newPostsNumber)
      setSavedPosts(newSavedPosts)
    }
  }

  const onSavePost = (postCard: PostCardComponentDto) => {
    setSavedPostsNumber(savedPostsNumber + 1)
    setSavedPosts([postCard, ...savedPosts])
  }

  const fetchSavedPosts = async () => {
    const savedPosts = await (new PostsApiService())
      .getSavedPosts(
        String(userComponentDto.id),
        1,
        defaultPerPage,
        InfrastructureSortingCriteria.DESC,
        InfrastructureSortingOptions.SAVED_DATE,
        [{ type: PostFilterOptions.SAVED_BY, value: userComponentDto.id }]
      )

    setSavedPosts(savedPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
    }))
    setSavedPostsNumber(savedPosts.postsNumber)
  }

  const fetchHistory = async () => {
    const postsHistory = await (new PostsApiService())
      .getUserHistory(
        String(userComponentDto.id),
        1,
        defaultPerPage,
        InfrastructureSortingCriteria.DESC,
        InfrastructureSortingOptions.VIEW_DATE,
        []
      )

    setPostsHistory(postsHistory.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
    }))
    setPostsHistoryNumber(postsHistory.postsNumber)
  }

  const fetchPosts = async () => {
    await Promise.all([
      fetchSavedPosts(),
      fetchHistory(),
    ])
  }

  useEffect(() => {
    setLoading(true)
    fetchPosts()
      .then(() => setLoading(false))
  }, [])

  let savedPostsContent: ReactElement

  if (savedPostsNumber === 0 && !loading) {
    if (status === 'authenticated' && userComponentDto.id === data?.user.id) {
      savedPostsContent = (<UserSavedPostsEmptyState />)
    } else {
      savedPostsContent = (<PostCardCarouselSkeleton postCardsNumber={ 3 } loading={ true }/>)
    }
  } else {
    if (loading) {
      savedPostsContent = (<PostCardCarouselSkeleton postCardsNumber={ 3 } loading={ true }/>)
    } else {
      savedPostsContent = (
        <PostCardCarousel
          posts={ savedPosts }
          postCardOptions={ [
            { type: 'deleteSavedPost', ownerId: userComponentDto.id, onDelete: onDeleteSavedPost },
            { type: 'react' },
          ] }
        />
      )
    }
  }

  let postsHistoryContent: ReactElement

  if (postsHistoryNumber === 0 && !loading) {
    postsHistoryContent = (
      <PostCardCarouselSkeleton postCardsNumber={ 3 }/>
    )
  } else {
    if (loading) {
      postsHistoryContent = (
        <PostCardCarouselSkeleton postCardsNumber={ 3 } loading={ true }/>
      )
    } else {
      postsHistoryContent = (
        <PostCardCarousel
          posts={ postsHistory }
          postCardOptions={ [
            { type: 'savePost', onSuccess: onSavePost },
            { type: 'react' },
          ] }
        />
      )
    }
  }

  return (
    <div className={ styles.userProfile__container }>
      <UserProfileHeader componentDto={ userComponentDto }/>

      <section className={ styles.userProfile__userPostsContainer }>
        <div className={ styles.userProfile__userPostsHeader }>
          { t('user_history_title') }
          {
            loading
              ? <span className={ styles.userProfile__userPostsSeeSkeleton }/>
              : <span className={ styles.userProfile__userPostsSeeAll }>
              {
                postsHistoryNumber < defaultPerPage
                  ? t('posts_number_title', { postsNumber: postsHistoryNumber })
                  : <Link
                    href={ `/users/${userComponentDto.username}/history` }
                    className={ styles.userProfile__userPostsSeeAllLink }
                    shallow={ false }
                    scroll={ true }
                  >
                    { t('see_all_button_title') }
                  </Link>
              }
            </span>
          }
        </div>
        { postsHistoryContent }

        <div className={ styles.userProfile__userPostsHeader }>
          { t('user_saved_posts_title') }
          {
            loading
              ? <span className={ styles.userProfile__userPostsSeeSkeleton }/>
              : <span className={ styles.userProfile__userPostsSeeAll }>
              { savedPostsNumber < defaultPerPage
                ? t('posts_number_title', { postsNumber: savedPostsNumber })
                : <Link
                  href={ `/users/${userComponentDto.username}/saved-posts` }
                  className={ styles.userProfile__userPostsSeeAllLink }
                  shallow={ false }
                  scroll={ true }
                >
                  { t('see_all_button_title') }
                </Link>
              }
            </span>
          }
        </div>
        { savedPostsContent }
      </section>
    </div>
  )
}
