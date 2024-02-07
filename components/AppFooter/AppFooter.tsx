import { FC } from 'react'
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
        <small key={ t('copyright_title') } className={ styles.footer__copyrightBrandName }/>,
      ] }
    />
  )

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
            src={ '/img/cheems-logo-text.png' }
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

        { /** TODO: Set profiles URLs **/ }
        <div className={ styles.appFooter__socialNetworks }>
          <Link href={ '#' } title={ t('facebook_icon_title') }>
            <FaFacebookF />
          </Link>
          <Link href={ '#' } title={ t('twitter_icon_title') }>
            <FaXTwitter />
          </Link>
          <Link href={ '#' } title={ t('tiktok_icon_title') }>
            <FaTiktok />
          </Link>
          <Link href={ '#' } title={ t('telegram_icon_title') }>
            <FaTelegramPlane />
          </Link>
        </div>
      </div>
    </footer>
  )
}
