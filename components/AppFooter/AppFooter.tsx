import { FC, ReactElement } from 'react'
import styles from './AppFooter.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaTelegramPlane, FaTiktok } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useRouter } from 'next/router'
import { Trans, useTranslation } from 'next-i18next'

export const AppFooter: FC = () => {
  const { asPath, locale } = useRouter()
  const { t } = useTranslation('footer')

  const transCopyright = (
    <Trans
      i18nKey={ t('copyright_title') }
      components={ [
        <small key={ t('copyright_title') } className={ styles.appFooter__copyrightBrandName }/>,
      ] }
    />
  )

  let facebookProfile: ReactElement | null = null
  let xProfile: ReactElement | null = null
  let tiktokProfile: ReactElement | null = null
  let telegramProfile: ReactElement | null = null

  if (process.env.NEXT_PUBLIC_FACEBOOK_PROFILE) {
    facebookProfile = (
      <Link
        href={ process.env.NEXT_PUBLIC_FACEBOOK_PROFILE }
        title={ t('facebook_icon_title') }
        target={ '_blank' }
      >
        <FaFacebookF />
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_X_PROFILE) {
    xProfile = (
      <Link
        href={ process.env.NEXT_PUBLIC_X_PROFILE }
        title={ t('twitter_icon_title') }
        target={ '_blank' }
      >
        <FaXTwitter />
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_TIKTOK_PROFILE) {
    tiktokProfile = (
      <Link
        href={ process.env.NEXT_PUBLIC_TIKTOK_PROFILE }
        title={ t('tiktok_icon_title') }
        target={ '_blank' }
      >
        <FaTiktok />
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_TELEGRAM_PROFILE) {
    telegramProfile = (
      <Link
        href={ process.env.NEXT_PUBLIC_TELEGRAM_PROFILE }
        title={ t('telegram_icon_title') }
        target={ '_blank' }
      >
        <FaTelegramPlane />
      </Link>
    )
  }

  return (
    <footer className={ styles.appFooter__layout }>
      <div className={ styles.appFooter__container }>
        <div className={ styles.appFooter__copyright }>
          { transCopyright }
        </div>
        <Link
          href='/'
          shallow={ true }
          className={ styles.appFooter__logoImageLink }
        >
          <Image
            alt={ t('app_logo_alt_title') }
            className={ styles.appFooter__logoImage }
            src={ '/img/app-logo-text.png' }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
          />
        </Link>
        <div className={ styles.appFooter__languages }>
          <Link
            className={ `
            ${styles.appFooter__languageItem}
            ${locale === 'es' ? styles.appFooter__languageItem__active : ''}
          ` }
            href={ asPath }
            locale={ 'es' }
          >
            { t('spanish_language_title') }
          </Link>

          <Link
            className={ `
            ${styles.appFooter__languageItem}
            ${locale === 'en' ? styles.appFooter__languageItem__active : ''}
          ` }
            href={ asPath }
            locale={ 'en' }
          >
            { t('english_language_title') }
          </Link>
        </div>

        { facebookProfile }
        { xProfile }
        { tiktokProfile }
        { telegramProfile }
      </div>
    </footer>
  )
}
