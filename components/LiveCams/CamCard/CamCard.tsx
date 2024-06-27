import { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { useTimer } from '~/hooks/Timer'
import { VideoLoadingState } from '~/components/VideoLoadingState/VideoLoadingState'
import styles from './CamCard.module.scss'
import { useRouter } from 'next/router'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { FaEye } from 'react-icons/fa'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import { DateService } from '~/helpers/Infrastructure/DateService'
import Image from 'next/image'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { useIsHovered } from '~/hooks/HoverComponent'

interface Props {
  username: string
  slug: string
  imageUrl: string
  secondsOnline: number
  usersOnline: number
  camGoal: string
  camRoomLink: string
}

interface MediaProps {
  username: string
  slug: string
  imageUrl: string
  secondsOnline: number
  usersOnline: number
  camGoal: string
  camRoomLink: string
}

const Media: FC<MediaProps> = ({ slug, secondsOnline, camRoomLink, imageUrl, username }) => {
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const timeLive = useTimer({ initialTime: secondsOnline })
  const [showIframe, setShowIframe] = useState<boolean>(false)
  const ref = useRef(null)

  useIsHovered(ref, () => setShowIframe(false))

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

  return (
    <>
      <div
        className={ styles.camCard__mediaWrapper }
        onTouchStart={ () => setShowIframe(true) }
        onMouseOver={ () => setShowIframe(true) }
        ref={ ref }
        // onMouseLeave={ () => setShowIframe(false) }
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
    </>
  )
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

  const locale = useRouter().locale ?? 'en'

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
        <Media
          username={ username }
          usersOnline={ usersOnline }
          camGoal={ camGoal }
          slug={ slug }
          camRoomLink={ camRoomLink }
          secondsOnline={ secondsOnline }
          imageUrl={ imageUrl }
        />
      <div className={ styles.camCard__liveSection }>
        { t('cam_card_live_title') }
        <span className={ styles.camCard__liveUsersViewers }>
          <FaEye className={ styles.camCard__liveIcon }/>
          { NumberFormatter.compatFormat(usersOnline, locale) }
        </span>
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
