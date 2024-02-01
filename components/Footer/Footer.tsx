import { FC } from 'react'
import styles from './Footer.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaTelegramPlane, FaTiktok } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useRouter } from 'next/router'

export const Footer: FC = () => {
  const { pathname, locale } = useRouter()

  return (
    <footer className={ styles.footer__layout }>
      <div className={ styles.footer__container }>
        <div className={ styles.footer__copyright }>
          © 2024
          <span className={ styles.footer__copyrightBrandName }>
        Cheems

      </span>
        </div>
        <Link
          href='/'
          shallow={ true }
          className={ styles.footer__logoImageLink }
        >
          <Image
            alt={ 'aaa' }
            className={ styles.footer__logoImage }
            src={ '/img/cheems-logo-text.png' }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
          />
        </Link>
        <div className={ styles.footer__languages }>
          <Link
            className={ `
          ${styles.footer__languageItem}
          ${locale === 'es' ? styles.footer__languageItem__active : ''}
        ` }
            href={ pathname }
            locale={ 'es' }
          >
            es
          </Link>

          <Link
            className={ `
          ${styles.footer__languageItem}
          ${locale === 'en' ? styles.footer__languageItem__active : ''}
        ` }
            href={ pathname }
            locale={ 'en' }
          >
            en
          </Link>
        </div>

        <div className={ styles.footer__socialNetworks }>
          <FaFacebookF />
          <FaXTwitter />
          <FaTiktok />
          <FaTelegramPlane />
        </div>
      </div>

    </footer>
  )
}
