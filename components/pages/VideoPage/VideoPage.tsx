import { NextPage } from 'next'
import styles from './VideoPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCardCarousel } from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarousel'
import { useTranslation } from 'next-i18next'
import { Post } from '~/modules/Posts/Infrastructure/Components/Post/Post'

export interface VideoPageProps {
  post: PostComponentDto
  relatedPosts: PostCardComponentDto[]
}

export const VideoPage: NextPage<VideoPageProps> = ({ post, relatedPosts }) => {
  const { t } = useTranslation('video_page')

  return (
    <div className={ styles.videoPage__container }>
      <Post
        post={ post }
        key={ post.id }
      />

      <span className={ styles.videoPage__relatedVideosTitle }>
        { t('video_related_videos_title') }
      </span>
      <PostCardCarousel posts={ relatedPosts } />
    </div>
  )
}
