import { Dispatch, FC, SetStateAction } from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './MobileMenu.module.scss'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { getMobileMenuOptions } from '~/components/AppMenu/MobileMenuOptions'

interface Props {
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
}

export const MobileMenu: FC<Props> = ({ openMenu, setOpenMenu }) => {
  const { pathname } = useRouter()

  const { t } = useTranslation('menu')

  // We translate the
  const menuOptions: MenuOptionComponentInterface[] = getMobileMenuOptions(pathname).map((menuOption) => {
    return {
      ...menuOption,
      title: t(menuOption.translationKey),
    }
  })

  return (
      <CSSTransition
        classNames={ {
          enter: styles.mobileMenu__backdropEnter,
          enterActive: styles.mobileMenu__backdropEnterActive,
          enterDone: styles.mobileMenu__backdropEnterDone,
          exit: styles.mobileMenu__backdropExit,
          exitActive: styles.mobileMenu__backdropExitActive,
          exitDone: styles.mobileMenu__backdropExitDone,
        } }
        in={ openMenu }
        timeout={ parseInt('500') }
      >
        <div
          className={ styles.mobileMenu__backdrop }
          onClick={ () => setOpenMenu(false) }
        >
          <CSSTransition
            classNames={ {
              enterActive: styles.mobileMenu__slideOutEnterActive,
              enterDone: styles.mobileMenu__slideOutEnterDone,
              exit: styles.mobileMenu__slideOutExit,
              exitActive: styles.mobileMenu__slideOutExitActive,
            } }
            in={ openMenu }
            timeout={ parseInt('500') }
          >
            <div className={ styles.mobileMenu__slideOut }>
              <div className={ styles.mobileMenu__logoContainer } >
                <img
                  className={ styles.mobileMenu__logo }
                  src='/img/cheems-logo.png'
                  alt={ t('menu_logo_alt_title') }
                />
              </div>

              <MenuOptions menuOptions={ menuOptions } />

              {
                /**
                 <div className={ styles.mobileMenu__footerContainer }>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 </div>
                 */
              }
              <div className={ styles.mobileMenu__copyrightContainer }>
                { t('copyright_section_title') }
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
  )
}
