import { FC, ReactElement } from 'react'
import styles from './TopMobileMenu.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import Link from 'next/link'
import { BsCameraVideo, BsCardImage, BsController } from 'react-icons/bs'
import { SiTinder } from 'react-icons/si'

export const TopMobileMenu: FC = () => {
  const { t } = useTranslation('menu')

  const links: ReactElement[] = []

  if (
    process.env.NEXT_PUBLIC_PARTNER_BACKLINK_URL &&
    process.env.NEXT_PUBLIC_PARTNER_BACKLINK_ANCHOR_TEXT
  ) {
    links.push(
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ process.env.NEXT_PUBLIC_PARTNER_BACKLINK_URL }
        title={ process.env.NEXT_PUBLIC_PARTNER_BACKLINK_ANCHOR_TEXT }
        key={ process.env.NEXT_PUBLIC_PARTNER_BACKLINK_ANCHOR_TEXT }
        rel={ 'follow' }
      >
        { process.env.NEXT_PUBLIC_PARTNER_BACKLINK_ANCHOR_TEXT }
      </Link>
    )
  }

  if (
    process.env.NEXT_PUBLIC_PARTNER_2_BACKLINK_URL &&
    process.env.NEXT_PUBLIC_PARTNER_2_BACKLINK_ANCHOR_TEXT
  ) {
    links.push(
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ process.env.NEXT_PUBLIC_PARTNER_2_BACKLINK_URL }
        title={ process.env.NEXT_PUBLIC_PARTNER_2_BACKLINK_ANCHOR_TEXT }
        key={ process.env.NEXT_PUBLIC_PARTNER_2_BACKLINK_ANCHOR_TEXT }
        rel={ 'follow' }
      >
        { process.env.NEXT_PUBLIC_PARTNER_2_BACKLINK_ANCHOR_TEXT }
      </Link>
    )
  }

  if (
    process.env.NEXT_PUBLIC_PARTNER_3_BACKLINK_URL &&
    process.env.NEXT_PUBLIC_PARTNER_3_BACKLINK_ANCHOR_TEXT
  ) {
    links.push(
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ process.env.NEXT_PUBLIC_PARTNER_3_BACKLINK_URL }
        title={ process.env.NEXT_PUBLIC_PARTNER_3_BACKLINK_ANCHOR_TEXT }
        key={ process.env.NEXT_PUBLIC_PARTNER_3_BACKLINK_ANCHOR_TEXT }
        rel={ 'follow' }
      >
        { process.env.NEXT_PUBLIC_PARTNER_3_BACKLINK_ANCHOR_TEXT }
      </Link>
    )
  }

  if (process.env.NEXT_PUBLIC_CAMS_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_CAMS_AD_URL) }
        title={ t('live_cams_advertising_title') }
        key={ t('live_cams_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <BsCameraVideo className={ styles.topMobileMenu__offerIcon }/>
          { t('live_cams_advertising_title') }
        </span>

      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_DATING_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_DATING_AD_URL) }
        title={ t('dating_advertising_title') }
        key={ t('dating_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <SiTinder className={ styles.topMobileMenu__offerIcon } />
          { t('dating_advertising_title') }
        </span>
      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_GAMES_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_GAMES_AD_URL) }
        title={ t('games_advertising_title') }
        key={ t('games_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <BsController className={ styles.topMobileMenu__offerIcon }/>
          { t('games_advertising_title') }
        </span>
      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_IA_AD_URL) {
    links.push(
      <div
        className={ styles.topMobileMenu__offerContainer }
        onClick={ () => handleClick(process.env.NEXT_PUBLIC_IA_AD_URL) }
        title={ t('ia_advertising_title') }
        key={ t('ia_advertising_title') }
      >
        <span className={ styles.topMobileMenu__offer }>
          <BsCardImage className={ styles.topMobileMenu__offerIcon }/>
          { t('ia_advertising_title') }
        </span>
      </div>
    )
  }

  if (links.length === 0) {
    return null
  }

  return (
    <div className={ styles.topMobileMenu__container }>
      { links }
      <Link
        className={ styles.topMobileMenu__offerContainer }
        href={ 'https://theporndude.com/' }
        title={ t('the_porn_dude_link_title') }
        key={ t('the_porn_dude_link_title') }
        rel={ 'nofollow' }
      >
        { t('the_porn_dude_link_title') }
      </Link>
    </div>
  )
}
