import { FC, useEffect, useState } from 'react'
import { Carousel, KeyedComponent } from '~/components/Carousel/Carousel'
import { CamCard } from '~/components/LiveCams/CamCard/CamCard'
import styles from './LiveCams.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import { CamCardSkeleton } from '~/components/LiveCams/CamCard/Skeleton/CamCardSkeleton'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'

export interface ActiveCamInterface {
  username: string
  slug: string
  image: string
  secondsOnline: number
  users: number
  camTitle: string
  camRoomLink: string
}

/** This component is dependent on chaturbate */
export const LiveCams: FC = () => {
  const [cams, setCams] = useState<ActiveCamInterface[]>([])
  const [camsCount, setCamsCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [userIp, setUserIp] = useState<string>('')
  const millisecondsBetweenRefresh = 300000

  const { t } = useTranslation('common')

  const getData = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org/?format=json')

      if (!response.ok) {
        setLoading(false)

        const responseData = await response.json()

        console.error(responseData)

        return null
      }

      const responseData = await response.json()

      return responseData.ip
    } catch (exception: unknown) {
      console.error(exception)

      return null
    }
  }

  const getActiveCams = async () => {
    let camsResponse
    let currentUserIp: string | null = userIp

    try {
      if (!userIp) {
        currentUserIp = await getData()

        if (!currentUserIp) {
          return
        }

        setUserIp(currentUserIp)
      }

      const response =
        await fetch(
          `https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=gqexH&client_ip=${currentUserIp}&limit=20`
        )

      if (!response.ok) {
        setLoading(false)

        const responseData = await response.json()

        console.error(responseData)

        return
      }

      camsResponse = await response.json()
    } catch (exception: unknown) {
      console.error(exception)

      setLoading(false)

      return
    }

    const activeCams: ActiveCamInterface[] = []

    for (const activeCam of camsResponse.results) {
      activeCams.push({
        username: activeCam.username,
        slug: activeCam.slug,
        image: activeCam.image_url,
        // initDate: DateTime.fromMillis(DateTime.now().toMillis() - activeCam.seconds_online),
        secondsOnline: activeCam.seconds_online,
        users: activeCam.num_users,
        camTitle: activeCam.room_subject,
        camRoomLink: activeCam.chat_room_url, // chat_room_url_revshare
      })
    }

    setCams(activeCams)
    setCamsCount(camsResponse.count)
    setLoading(false)
  }

  useEffect(() => {
    getActiveCams()
    const interval = setInterval(() => getActiveCams(), millisecondsBetweenRefresh)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!process.env.NEXT_PUBLIC_LIVE_CAMS_CAMPAIGN_URL) {
    return null
  }

  let content: KeyedComponent[] = Array.from(Array(5).keys())
    .map((key) => {
      return {
        key: String(key),
        component:
         <CamCardSkeleton loading={ loading } />,
      }
    })

  if (!loading && camsCount !== 0) {
    content = cams.map((cam) => {
      return {
        key: cam.username,
        component:
          <CamCard
            username={ cam.username }
            slug={ cam.slug }
            imageUrl={ cam.image }
            secondsOnline={ cam.secondsOnline }
            usersOnline={ cam.users }
            camGoal={ cam.camTitle }
            camRoomLink={ cam.camRoomLink }
          />,
      }
    })
  }

  return (
    <section className={ styles.liveCams__container }>
      <div className={ styles.liveCams__liveCamsTitle }>
        <span>
          <Trans
            i18nKey={ 'common:cams_carousel_title' }
            components={ [
              <span key={ t('cams_carousel_title') } className={ styles.liveCams__liveCamsCount }/>,
            ] }
            values={ { camCount: camsCount } }
          />
        </span>
        <button
          className={ styles.liveCams__liveCamsLink }
          onClick={ () => handleClick(process.env.NEXT_PUBLIC_LIVE_CAMS_CAMPAIGN_URL) }
        >
          { t('cams_carousel_link_title') }
        </button>
      </div>
      <Carousel
        itemsAutoWidth={ false }
        onEndReached={ undefined }
        showButtons={ true }
      >
        { content }
      </Carousel>
      <span className={ styles.liveCams__warningMessage }>
        { t('cams_carousel_warning_message') }
      </span>
    </section>
  )
}
