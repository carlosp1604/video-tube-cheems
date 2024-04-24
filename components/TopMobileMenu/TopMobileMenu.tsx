import { FC, ReactElement } from 'react'
import styles from './TopMobileMenu.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import Link from 'next/link'

export const TopMobileMenu: FC = () => {
  const { t } = useTranslation('menu')

  const links: ReactElement[] = []

  if (process.env.NEXT_PUBLIC_CAMS_AD_URL) {
    links.push(
      <span
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_CAMS_AD_URL) }
        title={ t('live_cams_advertising_title') }
        key={ t('live_cams_advertising_title') }
      >
        { t('live_cams_advertising_title') }
      </span>
    )
  }

  if (process.env.NEXT_PUBLIC_DATING_AD_URL) {
    links.push(
      <span
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_DATING_AD_URL) }
        title={ t('dating_advertising_title') }
        key={ t('dating_advertising_title') }
      >
        { t('dating_advertising_title') }
      </span>
    )
  }

  if (process.env.NEXT_PUBLIC_GAMES_AD_URL) {
    links.push(
      <span
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_GAMES_AD_URL) }
        title={ t('games_advertising_title') }
        key={ t('games_advertising_title') }
      >
        { t('games_advertising_title') }
      </span>
    )
  }

  if (process.env.NEXT_PUBLIC_IA_AD_URL) {
    links.push(
      <span
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_IA_AD_URL) }
        title={ t('ia_advertising_title') }
        key={ t('ia_advertising_title') }
      >
        { t('ia_advertising_title') }
      </span>
    )
  }

  if (links.length === 0) {
    return null
  }

  return (
    <div className={ styles.topMobileMenu__container }>
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ 'https://theporndude.com/' }
        title={ t('the_porn_dude_link_title') }
        key={ t('the_porn_dude_link_title') }
        rel={ 'nofollow' }
      >
        { t('the_porn_dude_link_title') }
      </Link>
      { links }
    </div>
  )
}
