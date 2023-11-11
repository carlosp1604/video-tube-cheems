import { NextPage } from 'next'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  HistoryDefaultSortingOption,
  HistorySortingOptions,
  SavedPostsDefaultSortingOption,
  SavePostsSortingOptions,
  SortingOption
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { useTranslation } from 'next-i18next'
import styles from './UserProfilePage.module.scss'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { useSession } from 'next-auth/react'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import {
  UserSavedPostsEmptyState
} from '~/modules/Auth/Infrastructure/Components/UserSavedPostsEmptyState/UserSavedPostsEmptyState'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useEffect, useState } from 'react'
import {
  UserProfilePostsSectionSelector,
  UserProfilePostsSectionSelectorType
} from '~/components/pages/UserProfilePage/UserProfilePostsSectionSelector/UserProfilePostsSectionSelector'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { useRouter } from 'next/router'
import { PostCardGalleryOption } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import {
  PaginatedPostCardGallery
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { useQueryState } from 'next-usequerystate'
import { parseAsInteger, parseAsString } from 'next-usequerystate/parsers'
import { useUpdateQuery } from '~/hooks/QueryState'
import { GalleryActionType, useGalleryAction } from '~/hooks/GalleryAction'

export interface UserProfilePageProps {
  page:number
  section: UserProfilePostsSectionSelectorType
  perPage: number
  userComponentDto: UserProfileHeaderComponentDto
  posts: PostCardComponentDto[]
  postsNumber: number
}

export const UserProfilePage: NextPage<UserProfilePageProps> = ({
  page,
  section,
  perPage,
  userComponentDto,
  posts,
  postsNumber,
}) => {
  const [sectionQueryParam] = useQueryState('section', parseAsString.withDefault('savedPosts'))
  const [pageQueryParam] = useQueryState('page', parseAsInteger.withDefault(1))
  const updateQuery = useUpdateQuery()
  const [currentSection, setCurrentSection] = useState<UserProfilePostsSectionSelectorType>(section)
  const [currentUserPosts, setCurrentUserPosts] = useState<PostCardComponentDto[]>(posts)
  const [currentUserPostsNumber, setCurrentUserPostsNumber] = useState<number>(postsNumber)
  const { t } = useTranslation(['user_profile', 'api_exceptions'])
  const getOptions = useGalleryAction()

  const { data } = useSession()
  const { locale } = useRouter()

  useEffect(() => {
    if (sectionQueryParam !== currentSection) {
      onPostSectionChange(sectionQueryParam as UserProfilePostsSectionSelectorType, pageQueryParam)
    }
  }, [sectionQueryParam])

  const onPostSectionChange = async (section: UserProfilePostsSectionSelectorType, page: number) => {
    switch (section) {
      case 'savedPosts': {
        const savedPosts = await fetchSavedPosts(page,
          SavedPostsDefaultSortingOption,
          [{ type: PostFilterOptions.SAVED_BY, value: userComponentDto.id }]
        )

        setCurrentUserPostsNumber(savedPosts.postsNumber)
        setCurrentUserPosts(savedPosts.posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
        }))
      }
        break

      case 'history': {
        const viewedPosts = await fetchUserHistory(page, HistoryDefaultSortingOption, [])

        setCurrentUserPostsNumber(viewedPosts.postsNumber)
        setCurrentUserPosts(viewedPosts.posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
        }))
      }
        break
    }

    setCurrentSection(section)
  }

  const options: PostCardGalleryOption[] = getOptions(GalleryActionType.SAVED_POSTS, userComponentDto.id)

  const fetchSavedPosts = async (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) => {
    return (new PostsApiService())
      .getSavedPosts(
        userComponentDto.id,
        pageNumber,
        perPage,
        sortingOption.criteria,
        sortingOption.option,
        filters
      )
  }

  const fetchUserHistory = async (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) => {
    return (new PostsApiService())
      .getUserHistory(
        userComponentDto.id,
        pageNumber,
        perPage,
        sortingOption.criteria,
        sortingOption.option,
        filters
      )
  }

  return (
    <div className={ styles.userProfilePage__container }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <UserProfilePostsSectionSelector
        selectedSection={ currentSection }
        onClickOption={ async (option) => {
          await onPostSectionChange(option, 1)

          await updateQuery([
            { key: 'section', value: option },
            { key: 'page', value: '1' },
          ])
        } }
      />

      <div className={ styles.userProfilePage__userPosts }>
        { currentSection === 'savedPosts'
          ? <PaginatedPostCardGallery
            perPage={ perPage }
            initialPage={ pageQueryParam }
            title={ t('user_saved_posts_title', { ns: 'user_profile' }) }
            initialPosts={ currentUserPosts }
            initialPostsNumber={ currentUserPostsNumber }
            filters={ [{
              type: PostFilterOptions.SAVED_BY,
              value: userComponentDto.id,
            }] }
            sortingOptions={ SavePostsSortingOptions }
            postCardOptions={ options }
            defaultSortingOption={ SavedPostsDefaultSortingOption }
            fetchPosts={ fetchSavedPosts }
            emptyState={ data && data.user.id === userComponentDto.id
              ? <UserSavedPostsEmptyState/>
              : <EmptyState
                title={ t('saved_posts_empty_title', { ns: 'user_profile' }) }
                subtitle={ t('saved_posts_empty_subtitle', { name: userComponentDto.name, ns: 'user_profile' }) }
              />
            }
          />
          : null
        }
        { currentSection === 'history'
          ? <PaginatedPostCardGallery
            initialPage={ pageQueryParam }
            perPage={ perPage }
            title={ t('user_history_title', { ns: 'user_profile' }) }
            initialPosts={ currentUserPosts }
            initialPostsNumber={ currentUserPostsNumber }
            filters={ [] }
            sortingOptions={ HistorySortingOptions }
            postCardOptions={ [] }
            defaultSortingOption={ HistoryDefaultSortingOption }
            fetchPosts={ fetchUserHistory }
            emptyState={ data && data.user.id === userComponentDto.id
              ? <EmptyState
                  title={ t('own_history_empty_title', { ns: 'user_profile' }) }
                  subtitle={ t('own_history_empty_subtitle', { ns: 'user_profile' }) }
                />
              : <EmptyState
                  title={ t('history_empty_title', { ns: 'user_profile' }) }
                  subtitle={ t('history_empty_subtitle', { ns: 'user_profile', name: userComponentDto.name }) }
                />
            }
          />
          : null
        }
      </div>
    </div>
  )
}
