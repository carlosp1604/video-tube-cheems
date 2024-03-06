import { FC, useEffect, useState } from 'react'
import { Carousel, KeyedComponent } from '~/components/Carousel/Carousel'
import { CamCard } from '~/components/LiveCams/CamCard/CamCard'
import styles from './LiveCams.module.scss'
import Link from 'next/link'
import { Trans, useTranslation } from 'next-i18next'
import { CamCardSkeleton } from '~/components/LiveCams/CamCard/Skeleton/CamCardSkeleton'

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
  const [ip, setIp] = useState<string>('')
  const [cams, setCams] = useState<ActiveCamInterface[]>([])
  const [camsCount, setCamsCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const { t } = useTranslation('common')

  const getData = async () => {
    try {
      const response = await fetch('https://api.ipify.org/?format=json')

      if (!response.ok) {
        setLoading(false)

        const responseData = await response.json()

        console.error(responseData)

        return
      }

      const responseData = await response.json()

      setIp(responseData.ip)
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  const getActiveCams = async () => {
    let camsResponse

    try {
      const response =
        await fetch(`https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=gqexH&client_ip=${ip}&limit=20`)

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
    getData()
  }, [])

  useEffect(() => {
    if (ip === '') {
      return
    }

    getActiveCams()
  }, [ip])

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
            i18nKey={ t('cams_carousel_title') }
            components={ [
              <span key={ t('cams_carousel_title') } className={ styles.liveCams__liveCamsCount }/>,
            ] }
            values={ { camCount: camsCount } }
          />
        </span>
        <Link
          href={ 'https://chaturbate.com/in/?tour=LQps&campaign=gqexH&track=default&room=cp1022' }
          className={ styles.liveCams__liveCamsLink }
          target={ '_blank' }
        >
          { t('cams_carousel_link_title') }
        </Link>
      </div>
      <Carousel
        itemsAutoWidth={ false }
        onEndReached={ undefined }
      >
        { content }
      </Carousel>
      <span className={ styles.liveCams__warningMessage }>
        { t('cams_carousel_warning_message') }
      </span>
    </section>
  )
}
