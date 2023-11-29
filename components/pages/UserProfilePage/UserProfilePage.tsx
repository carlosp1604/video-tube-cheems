import { NextPage } from 'next'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './UserProfilePage.module.scss'
import { useTranslation } from 'next-i18next'
import { BsDot } from 'react-icons/bs'
import {
  UserProfilePostsSectionSelector,
  UserProfilePostsSectionSelectorType
} from '~/components/pages/UserProfilePage/UserProfilePostsSectionSelector/UserProfilePostsSectionSelector'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  UserSavedPostsEmptyState
} from '~/modules/Auth/Infrastructure/Components/UserSavedPostsEmptyState/UserSavedPostsEmptyState'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'

export interface UserProfilePageProps {
  userComponentDto: UserProfileHeaderComponentDto
  section: UserProfilePostsSectionSelectorType
  posts: PostCardComponentDto[]
  postsNumber: number
}

export const UserProfilePage: NextPage<UserProfilePageProps> = ({
  userComponentDto,
  section,
  posts,
  postsNumber,
}) => {
  const [currentPosts, setCurrentPosts] = useState<PostCardComponentDto[]>(posts)
  const [currentPostsNumber, setCurrentPostsNumber] = useState<number>(postsNumber)
  const [selectedSection, setSelectedSection] = useState<UserProfilePostsSectionSelectorType>(section)
  const [loading, setLoading] = useState(false)

  const { t } = useTranslation('user_profile')
  const { replace, locale } = useRouter()
  const { status, data } = useSession()

  const onDeleteSavedPost = (postId: string) => {
    const newPostList = currentPosts.filter((post) => post.id !== postId)

    setCurrentPosts(newPostList)
    setCurrentPostsNumber(currentPostsNumber - 1)
  }

  const updatePosts = async (section: UserProfilePostsSectionSelectorType) => {
    setLoading(true)
    switch (section) {
      case 'savedPosts': {
        try {
          const newPosts = await (new PostsApiService())
            .getSavedPosts(
              userComponentDto.id,
              1,
              defaultPerPage,
              InfrastructureSortingCriteria.DESC,
              InfrastructureSortingOptions.SAVED_DATE,
              [{ type: PostFilterOptions.SAVED_BY, value: userComponentDto.id }]
            )

          setCurrentPosts(newPosts.posts.map((post) => {
            return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
          }))
          setCurrentPostsNumber(newPosts.postsNumber)
        } catch (exception) {
          console.error(exception)
        }

        break
      }

      case 'history': {
        try {
          const newPosts = await (new PostsApiService())
            .getUserHistory(
              userComponentDto.id,
              1,
              defaultPerPage,
              InfrastructureSortingCriteria.DESC,
              InfrastructureSortingOptions.VIEW_DATE,
              []
            )

          setCurrentPosts(newPosts.posts.map((post) => {
            return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
          }))
          setCurrentPostsNumber(newPosts.postsNumber)
        } catch (exception) {
          console.error(exception)
        }

        break
      }

      default:
        break
    }
    setLoading(false)
  }

  const onSectionChange = async (section: UserProfilePostsSectionSelectorType) => {
    setSelectedSection(section)
    await replace({
      query: {
        username: userComponentDto.username,
        section,
      },
    }, undefined, { shallow: true, scroll: false })
    await updatePosts(section)
  }

  const postsPerList = 20

  let postsList: ReactElement | null

  if (
    selectedSection === 'savedPosts' &&
    currentPostsNumber === 0 &&
    status === 'authenticated' &&
    data &&
    data.user.id === userComponentDto.id
  ) {
    postsList = <UserSavedPostsEmptyState />
  } else {
    postsList = (
      <PostCardGallery
        loading={ loading }
        posts={ loading ? [] : currentPosts }
        postCardOptions={ currentPostsNumber === 0
          ? []
          : (selectedSection === 'savedPosts'
              ? [{ type: 'react' }, { type: 'deleteSavedPost', onDelete: onDeleteSavedPost }]
              : [{ type: 'react' }, { type: 'savePost' }]
            )
        }
        owner={ userComponentDto.id }
      />
    )
  }

  return (
    <div className={ styles.userProfilePage__container }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <UserProfilePostsSectionSelector
        selectedSection={ selectedSection }
        onClickOption={ onSectionChange }
      />

      <div className={ styles.userProfilePage__userPosts }>
        <div className={ styles.userProfilePage__userPostsHeader }>
          <div className={ styles.userProfilePage__userPostsHeaderTitle }>
            { selectedSection === 'savedPosts' ? t('user_saved_posts_title') : t('user_history_title') }
            <BsDot className={ styles.userProfilePage__userPostsHeaderSeparatorIcon }/>
            <span className={ styles.userProfilePage__userPostsHeaderPostsQuantity }>
              { t('posts_number_title', { postsNumber: currentPostsNumber }) }
            </span>
          </div>
          <button className={ `
            ${styles.userProfilePage__userPostsSeeAllButton}
            ${currentPostsNumber > postsPerList ? styles.userProfilePage__userPostsSeeAllButton__visible : ''}
          ` }
            title={ t('see_all_button_title') }
          >
            { t('see_all_button_title') }
          </button>
          <span className={ `
            ${styles.userProfilePage__noPostsTitle}
            ${currentPostsNumber === 0 ? styles.userProfilePage__noPostsTitle_visible : ''}
            ` }>
            { t('nothing_to_see_message_title') }
          </span>
          <span className={ `
            ${styles.userProfilePage__noPostsTitle}
            ${currentPostsNumber > 0 && currentPostsNumber <= postsPerList
              ? styles.userProfilePage__noPostsTitle_visible
              : ''}
            ` }>
            { t('that_is_all_message_title') }
          </span>
        </div>
        { postsList }
      </div>
    </div>
  )
}
