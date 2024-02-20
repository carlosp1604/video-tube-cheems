import { FC, ReactElement } from 'react'
import styles from './TopMobileMenu.module.scss'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

export const TopMobileMenu: FC = () => {
  const { t } = useTranslation('menu')

  const links: ReactElement[] = []

  if (process.env.NEXT_PUBLIC_CAMS_AD_URL) {
    links.push(
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ process.env.NEXT_PUBLIC_CAMS_AD_URL }
        title={ t('live_cams_advertising_title') }
        key={ t('live_cams_advertising_title') }
      >
        { t('live_cams_advertising_title') }
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_DATING_AD_URL) {
    links.push(
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ process.env.NEXT_PUBLIC_DATING_AD_URL }
        title={ t('dating_advertising_title') }
        key={ t('dating_advertising_title') }>
        { t('dating_advertising_title') }
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_GAMES_AD_URL) {
    links.push(
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ process.env.NEXT_PUBLIC_GAMES_AD_URL }
        title={ t('games_advertising_title') }
        key={ t('games_advertising_title') }
      >
        { t('games_advertising_title') }
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_IA_AD_URL) {
    links.push(
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ process.env.NEXT_PUBLIC_IA_AD_URL }
        title={ t('ia_advertising_title') }
        key={ t('ia_advertising_title') }
      >
        { t('ia_advertising_title') }
      </Link>
    )
  }

  if (links.length === 0) {
    return null
  }

  return (
    <div className={ styles.topMobileMenu__container }>
      { links }
    </div>
  )
}
