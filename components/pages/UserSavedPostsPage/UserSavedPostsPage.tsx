import { NextPage } from 'next'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import styles from './UserProfilePage.module.scss'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
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

export interface UserSavedPostsPageProps {
  username: string
}

export const UserSavedPostsPage: NextPage<UserSavedPostsPageProps> = ({ username }) => {
  const [loading, setLoading] = useState(false)

  const [posts, setPosts] = useState<PostCardComponentDto[]>([])
  const [postsNumber, setPostsNumber] = useState<number>(0)

  const { t } = useTranslation('user_profile')

  const locale = useRouter().locale ?? 'en'

  const onDeleteSavedPost = (postId: string) => {
    const newPosts = posts.filter((post) => post.id !== postId)

    setPosts(newPosts)
    setPostsNumber(postsNumber - 1)
  }

  const fetchPosts = async () => {
    const posts = await (new PostsApiService())
      .getSavedPosts(
        username,
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

    setPostsHistory(postsHistory.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
    }))
    setPostsHistoryNumber(postsHistory.postsNumber)
  }

  useEffect(() => {
    setLoading(true)
    fetchPosts()
      .then(() => setLoading(false))
  }, [])

  let savedPostsContent: ReactElement

  if (savedPostsNumber === 0 && !loading) {
    savedPostsContent = (<UserSavedPostsEmptyState />)
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

  return (
    <div className={ styles.userProfilePage__container }>
      <UserProfileHeader componentDto={ userComponentDto }/>

      <section className={ styles.userProfilePage__userPostsContainer }>
        <div className={ styles.userProfilePage__userPostsHeader }>
          { t('user_history_title') }
          {
            loading
              ? <span className={ styles.userProfilePage__userPostsSeeSkeleton }/>
              : <span className={ styles.userProfilePage__userPostsSeeAll }>
              {
                postsHistoryNumber < defaultPerPage
                  ? t('posts_number_title', { postsNumber: postsHistoryNumber })
                  : <Link
                    href={ '/' }
                    className={ styles.userProfilePage__userPostsSeeAllLink }
                    shallow={ false }
                    scroll={ true }
                  >
                    { t('see_all_button_title') }
                  </Link>
              }
            </span>
          }
        </div>
        {
          loading
            ? <PostCardCarouselSkeleton postCardsNumber={ 3 } loading={ true }/>
            : <PostCardCarousel
              posts={ postsHistory }
              postCardOptions={ [
                { type: 'savePost', onSuccess: onSavePost },
                { type: 'react' },
              ] }
            />
        }

        <div className={ styles.userProfilePage__userPostsHeader }>
          { t('user_saved_posts_title') }
          {
            loading
              ? <span className={ styles.userProfilePage__userPostsSeeSkeleton }/>
              : <span className={ styles.userProfilePage__userPostsSeeAll }>
              { savedPostsNumber < defaultPerPage
                ? t('posts_number_title', { postsNumber: savedPostsNumber })
                : <Link
                  href={ '/' }
                  className={ styles.userProfilePage__userPostsSeeAllLink }
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
