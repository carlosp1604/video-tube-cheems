import { Dispatch, FC, SetStateAction } from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './MobileMenu.module.scss'
import { BsBookmarks, BsCameraVideo, BsClock, BsHeart, BsHouse } from 'react-icons/bs'
import { TbClipboardCheck } from 'react-icons/tb'

interface Props {
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
}

export const MobileMenu: FC<Props> = ({ openMenu, setOpenMenu }) => {

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
              <div className={ styles.mobileMenu__logoContainer} >
                <img
                  className={ styles.mobileMenu__logo }
                  src='/img/cheems-logo.png'
                />
              </div>

              <div className={ styles.mobileMenu__menu_container }>
                <div
                  className={ `
                  ${styles.mobileMenu__menuItem}
                  ${styles.mobileMenu__menuItemActive}
                  ` }
                >
                  <span className={ styles.mobileMenu__menuItemContent }>
                    <BsHouse className={ styles.mobileMenu__menuIcon }/>
                    Home
                  </span>
                </div>

                <div className={ styles.mobileMenu__menuItem }>
                  <span className={ styles.mobileMenu__menuItemContent }>
                    <TbClipboardCheck className={ styles.mobileMenu__menuIcon }/>
                    Following
                  </span>
                </div>

                <div className={ styles.mobileMenu__menuItem }>
                  <span className={ styles.mobileMenu__menuItemContent }>
                    <BsBookmarks
                      className={ styles.mobileMenu__menuIcon }
                    />
                    Saved
                  </span>
                </div>

                <div className={ styles.mobileMenu__menuItem }>
                  <span className={ styles.mobileMenu__menuItemContent }>
                    <BsHeart
                      className={ styles.mobileMenu__menuIcon }
                    />
                    Reacted
                  </span>
                </div>

                <div className={ styles.mobileMenu__menuItem }>
                  <span className={ styles.mobileMenu__menuItemContent }>
                    <BsClock
                      className={ styles.mobileMenu__menuIcon }
                    />
                    Check Later
                  </span>
                </div>

                <div className={ styles.mobileMenu__menuItem }>
                  <span className={ styles.mobileMenu__menuItemContent }>
                    <BsCameraVideo
                      className={ styles.mobileMenu__menuIcon }
                    />
                    Live Cams
                  </span>
                </div>

            </div>

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

              <div className={ styles.mobileMenu__copyrightContainer}>
                Cheems © 2023. Made with ❤️ by CP.
              </div>

            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
  )
}
