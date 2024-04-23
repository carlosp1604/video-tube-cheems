import styles from './VideoEmbedPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import { FC } from 'react'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'

export interface VideoEmbedPageProps {
  post: PostComponentDto
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const VideoEmbedPage: FC<VideoEmbedPageProps> = ({
  post,
  htmlPageMetaContextProps,
}) => {
  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      post.title,
      post.description,
      HtmlPageMetaContextResourceType.WEBSITE,
      post.thumb
    )
  ).getProperties()
  const htmlPageMetaProps = { ...htmlPageMetaContextProps, resourceProps: htmlPageMetaUrlProps }
  const { t } = useTranslation('post')

  return (
    <div className={ styles.videoEmbedPage__container }>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <HtmlPageMeta { ...htmlPageMetaProps } />

      <VideoPostPlayer
        title={ t('post_player_title', { postName: post.title }) }
        embedPostMedia={ post.postMediaEmbedType.length > 0 ? post.postMediaEmbedType[0] : null }
        videoPostMedia={ post.postMediaVideoType.length > 0 ? post.postMediaVideoType[0] : null }
      />
    </div>
  )
}
