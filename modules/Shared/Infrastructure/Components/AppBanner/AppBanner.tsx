import { FC, ReactElement } from 'react'
import styles from './AppBanner.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import Link from 'next/link'
import Image from 'next/image'

export type HeaderTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface AppBannerProps {
  title: string
  headerTag: HeaderTag
  description: string
}

export const AppBanner: FC<AppBannerProps> = ({ title, headerTag, description }) => {
  const { t } = useTranslation('common')

  let rtaSection: ReactElement | null = null

  const DynamicTag = headerTag

  if (process.env.NEXT_PUBLIC_RTA_LABEL) {
    rtaSection = (
      <div className={ styles.appBanner__rtaSection }>
        <span>
          <Trans
            i18nKey={ 'common:rta_description_title' }
            components={ [
              <Link
                key={ t('rta_description_title') }
                className={ styles.appBanner__rtaBlockAccessLink }
                href={ 'https://www.rtalabel.org/index.html?content=parents' }
                target={ '_blank' }
              />,
            ] }
          />
        </span>

        <Link href='https://www.rtalabel.org/'>
          <Image
            alt={ t('rta_logo_alt_title') }
            className={ styles.appBanner__rtaLogo }
            src={ '/img/rta-image.webp' }
            width={ 308 }
            height={ 140 }
            sizes={ '100vw' }
          />
        </Link>
      </div>
    )
  }

  return (
    <div className={ styles.appBanner__container }>
      <DynamicTag className={ styles.appBanner__title }>
        { title }
      </DynamicTag>
      <p className={ styles.appBanner__description }>
        { description }
      </p>
      { rtaSection }
    </div>
  )
}
