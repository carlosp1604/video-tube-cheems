import { FC, ReactElement } from 'react'
import styles from './AppBanner.module.scss'
import { Trans, useTranslation } from 'next-i18next'
import Link from 'next/link'
import Image from 'next/image'

export const AppBanner: FC = () => {
  const { t } = useTranslation('app_banner')

  let rtaSection: ReactElement | null = null

  if (process.env.NEXT_PUBLIC_RTA_LABEL) {
    rtaSection = (
      <div className={ styles.appBanner__rtaSection }>
        <span>
          <Trans
            i18nKey={ t('rta_description_title') }
            components={ [
              <Link
                key={ t('rta_description_title') }
                className={ styles.appBanner__rtaBlockAccessLink }
                href={ 'https://www.rtalabel.org/index.html?content=parents' }
              />,
            ] }
          />
        </span>

        <Link href='https://www.rtalabel.org/'>
          <Image
            alt={ t('rta_logo_alt_title') }
            className={ styles.appBanner__rtaLogo }
            src={ '/img/rta-image.png' }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
          />
        </Link>
      </div>
    )
  }

  return (
    <section className={ styles.appBanner__container }>
      <h1 className={ styles.appBanner__title }>
        { t('banner_title') }
      </h1>

      <p className={ styles.appBanner__description }>
        { t('banner_description') }
      </p>

      { rtaSection }
    </section>
  )
}
