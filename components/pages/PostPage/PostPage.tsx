import { NextPage } from 'next'
import styles from './PostPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCardCarousel } from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarousel'
import { useTranslation } from 'next-i18next'
import { Post } from '~/modules/Posts/Infrastructure/Components/Post/Post'

export interface VideoPageProps {
  post: PostComponentDto
  postViewsNumber: number
  postLikes: number
  postDislikes: number
  postCommentsNumber: number
  relatedPosts: PostCardComponentDto[]
}

export const PostPage: NextPage<VideoPageProps> = ({
  post,
  relatedPosts,
  postCommentsNumber,
  postViewsNumber,
  postLikes,
  postDislikes,
}) => {
  const { t } = useTranslation('post_page')

  return (
    <div className={ styles.postPage__container }>
      <Post
        post={ post }
        key={ post.id }
        postCommentsNumber={ postCommentsNumber }
        postLikes={ postLikes }
        postDislikes={ postDislikes }
        postViewsNumber={ postViewsNumber }
      />

      <span className={ styles.postPage__relatedVideosTitle }>
        { t('video_related_videos_title') }
      </span>

      <PostCardCarousel
        posts={ relatedPosts }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
      />
    </div>
  )
}
