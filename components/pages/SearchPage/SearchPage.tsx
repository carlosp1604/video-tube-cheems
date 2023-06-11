import styles from './SearchPage.module.scss'
import { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  PaginatedPostCardGallery
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'

export interface SearchPageProps {
  posts: PostCardComponentDto[]
  postsNumber: number
  title: string
}

export const SearchPage: NextPage<SearchPageProps> = ({ posts, title, postsNumber }) => {
  const [totalPosts, setTotalPosts] = useState<number>(postsNumber)
  const [titleFilter, setTitleFilter] = useState<FetchPostsFilter>({
    type: PostFilterOptions.POST_TITLE,
    value: title,
  })
  const router = useRouter()

  if (router.query.search && router.query.search !== titleFilter.value) {
    setTitleFilter({
      ...titleFilter,
      value: router.query.search.toString(),
    })
  }

  return (
    <div className={ styles.searchPage__container }>
      <PaginatedPostCardGallery
        initialPosts={ posts }
        initialPostsNumber={ totalPosts }
        filters={ [titleFilter] }
        title={ title }
      />
    </div>
  )
}
