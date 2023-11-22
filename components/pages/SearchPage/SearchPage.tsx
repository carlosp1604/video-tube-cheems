import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'

export interface SearchPageProps {
  posts: PostCardComponentDto[]
  postsNumber: number
  title: string
}

export const SearchPage: NextPage<SearchPageProps> = ({ posts, title, postsNumber }) => {
  return (
    <></>
  )
}
