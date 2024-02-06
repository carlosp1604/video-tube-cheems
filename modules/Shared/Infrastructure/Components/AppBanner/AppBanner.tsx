import { FC } from 'react'
import styles from './AppBanner.module.scss'
import { useTranslation } from 'next-i18next'

export const AppBanner: FC = () => {
  const { t } = useTranslation('app_banner')

  return (
    <section className={ styles.appBanner__container }>
      <h1 className={ styles.appBanner__title }>
        { t('banner_title') }
      </h1>

      <p className={ styles.appBanner__description }>
        { t('banner_description') }
      </p>
    </section>
  )
}
