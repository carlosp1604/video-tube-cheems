import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PostCardComponentDto } from '../../../modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { FetchPostsFilter } from '../../../modules/Shared/Infrastructure/InfrastructureFilter'
import { PaginatedPostCardGallery } from '../../PaginatedPostCardGallery/PaginatedPostCardGallery'
import styles from './SearchPage.module.scss'

export interface SearchPageProps {
  posts: PostCardComponentDto[]
  postsNumber: number
  title: string
}

export const SearchPage: NextPage<SearchPageProps> = ({ posts, title, postsNumber }) => {
  const [totalPosts, setTotalPosts] = useState<number>(postsNumber)
  const [titleFilter, setTitleFilter] = useState<FetchPostsFilter>({
    type: 'postTitle',
    value: title
  })
  const router = useRouter()

  useEffect(() => {
    if (router.query.search) {
      setTitleFilter({
        ...titleFilter,
        value: router.query.search.toString()
      })
    }
  }, [router.query])

  return (
    <div className={ styles.searchPage__container }>
      <h1 className={ styles.searchPage__title }>
        { `Resultados para ${title}`}
        <span className={ styles.searchPage__videosQuantity }>
          {`${totalPosts} Videos`}
        </span>
      </h1>

      <PaginatedPostCardGallery
        posts={ posts }
        postsNumber={ postsNumber }
        setPostsNumber={ setTotalPosts }
        fetchEndpoint={'/api/posts'}
        filters={[titleFilter]}
      />
    </div>
  )
}