import Image from 'next/image'
import styles from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { BsDot } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import {
  PostCardAdvertisingName
} from '~/modules/Shared/Infrastructure/Components/Advertising/PostCardAdvertisingName'

interface Props {
  offerUrl: string
  thumb: string
  title: string
  adNetworkName: string
  views: number
  date: string
  iframeMode: boolean
}

export const PostCardAdvertising: FC<Props> = ({ offerUrl, thumb, title, adNetworkName, views, date, iframeMode }) => {
  const { t } = useTranslation('common')

  const locale = useRouter().locale ?? 'en'

  return (
    <div
      className={ styles.postCard__adContainer }
      onClick={ () => handleClick(offerUrl) }
    >
      <div className={ styles.postCard__videoContainer }>
        { iframeMode
          ? <iframe
            src={ thumb }
            allowFullScreen={ false }
            loading={ 'lazy' }
            title={ title }
          />
          : <Image
            src={ thumb }
            alt={ title }
            className={ styles.postCard__media }
            width={ 200 }
            height={ 200 }
            sizes={ '100vw' }
            placeholder={ 'blur' }
            priority={ true }
            blurDataURL={ rgbDataURL(81, 80, 80) }
          />
        }

      </div>
      <div className={ styles.postCard__videoDataContainer }>
        <div className={ styles.postCard__postData }>
          <span className={ styles.postCard__videoTitleLink } >
            { title }
          </span>
          <PostCardAdvertisingName name={ adNetworkName } />
          <div className={ styles.postCard__extraData }>
            { t('post_card_post_views',
              { views: NumberFormatter.compatFormat(Math.floor(views), locale) })
            }
            <BsDot className={ styles.postCard__separatorIcon }/>
            { date }
          </div>
        </div>
      </div>
    </div>
  )
}
