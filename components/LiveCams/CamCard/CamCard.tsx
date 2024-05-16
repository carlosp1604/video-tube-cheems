import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTimer } from '~/hooks/Timer'
import { MdOutlineTouchApp } from 'react-icons/md'
import { VideoLoadingState } from '~/components/VideoLoadingState/VideoLoadingState'
import styles from './CamCard.module.scss'
import { useRouter } from 'next/router'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { FaEye } from 'react-icons/fa'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import { DateService } from '~/helpers/Infrastructure/DateService'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'

interface Props {
  username: string
  slug: string
  imageUrl: string
  secondsOnline: number
  usersOnline: number
  camGoal: string
  camRoomLink: string
}

export const CamCard: FC<Props> = ({
  username,
  slug,
  imageUrl,
  secondsOnline,
  usersOnline,
  camGoal,
  camRoomLink,
}) => {
  const { t } = useTranslation('common')
  const [showIframe, setShowIframe] = useState<boolean>(false)
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const timeLive = useTimer({ initialTime: secondsOnline })

  const locale = useRouter().locale ?? 'en'

  const iframeUrl = useMemo(() => {
    const params = new URLSearchParams()

    params.append('tour', '9oGW')
    params.append('campaign', 'gqexH')
    params.append('track', 'embed')
    params.append('room', slug)
    params.append('bgcolor', 'white')
    params.append('embed_video_only', 'true')

    return `https://chaturbate.com/in/?${params}`
  }, [slug])

  const onReady = () => {
    setVideoReady(true)
  }

  useEffect(() => {
    if (!showIframe) {
      setVideoReady(false)
    }
  }, [showIframe])

  let iframeElement: ReactElement | null = null

  if (showIframe) {
    iframeElement = (
      <iframe
        src={ iframeUrl }
        scrolling={ 'no' }
        onCanPlay={ onReady }
      />
    )
  }

  const mediaElement = (
    <Image
      src={ imageUrl }
      alt={ username }
      className={ styles.camCard__image }
      width={ 200 }
      height={ 200 }
      sizes={ '100vw' }
      placeholder={ 'blur' }
      blurDataURL={ rgbDataURL(81, 80, 80) }
      onClick={ () => handleClick(camRoomLink) }
    />
  )

  const transCamTitle = (
    <span
      className={ styles.camCard__titleLink }
      onClick={ () => handleClick(camRoomLink) }
    >
      <Trans
        i18nKey={ 'common:cam_card_title' }
        components={ [<span key={ t('cam_card_title') } className={ styles.camCard__username }/>] }
        values={ { camUsername: username } }
      />
    </span>
  )

  return (
    <div className={ styles.camCard__container }>
      <div
        className={ styles.camCard__mediaWrapper }
        onMouseOver={ () => setShowIframe(true) }
        onMouseLeave={ () => setShowIframe(false) }
      >
        { !videoReady
          ? <span onClick={ () => handleClick(camRoomLink) }>
            <VideoLoadingState />
          </span>
          : null
        }
        { !showIframe ? mediaElement : null }
        { showIframe ? iframeElement : null }
      </div>
      <span className={ `
        ${styles.camCard__liveTime}
        ${showIframe ? styles.camCard__liveTime__visible : ''}
      ` }>
        { new DateService().formatSecondsToHHMMSSFormat(timeLive) }
      </span>
      <div className={ styles.camCard__liveSection }>
        { t('cam_card_live_title') }
        <span className={ styles.camCard__liveUsersViewers }>
          <FaEye className={ styles.camCard__liveIcon }/>
          { NumberFormatter.compatFormat(usersOnline, locale) }
        </span>
      </div>
      <div
        className={ `
          ${styles.camCard__playButton}
          ${showIframe ? styles.camCard__playButton__hidden : ''}
        ` }
        onClickCapture={ () => setShowIframe(true) }
        onMouseOver={ () => setShowIframe(true) }
        onMouseLeave={ () => setShowIframe(false) }
      >
        <MdOutlineTouchApp title={ 'cam_card_play_button' }/>
      </div>
      <div className={ styles.camCard__title }>
        { transCamTitle }
        <span className={ styles.camCard__description }>
        { camGoal }
        </span>
      </div>
    </div>
  )
}
