import { NextPage } from 'next'
import styles from './EmbedPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { ReactNode, useMemo, useState } from 'react'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import { BsFileEarmarkBreak } from 'react-icons/bs'
import Head from 'next/head'

export interface EmbedPageProps {
  post: PostComponentDto
}

export const EmbedPage: NextPage<EmbedPageProps> = ({ post }) => {
  const [sourcesMenuOpen, setSourcesMenuOpen] = useState<boolean>(false)

  const { t } = useTranslation('post_page')

  const selectableUrls = useMemo(() => {
    return MediaUrlsHelper.getSelectableUrls(
      post.postMediaEmbedType,
      post.postMediaVideoType
    )
  }, [post.postMediaEmbedType, post.postMediaVideoType])

  let player: ReactNode = (
    <div className={ styles.embedPage__noSourcesState }>
      <BsFileEarmarkBreak className={ styles.embedPage__noSourcesStateIcon }/>
      { t('post_video_no_sources_error_message') }
    </div>
  )

  if (selectableUrls.length > 0) {
    player = (
      <VideoPostPlayer
        title={ t('post_player_title', { postName: post.title }) }
        selectableUrls={ selectableUrls }
        sourcesMenuOpen={ sourcesMenuOpen }
        onCloseSourceMenu={ () => setSourcesMenuOpen(false) }
        setSourcesMenuOpen={ setSourcesMenuOpen }
      />
    )
  }

  return (
    <>
      <Head>
        <title>{ post.title }</title>
        <meta name={ 'robots' } content={ 'index' } />
      </Head>

      { player }
    </>
  )
}
