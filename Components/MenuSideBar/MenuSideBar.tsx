import { FC } from 'react'
import styles from './MenuSideBar.module.scss'
import { BsBookmarks, BsCameraVideo, BsClipboardCheck, BsClock, BsHeart, BsHouse } from 'react-icons/bs'
import Link from 'next/link'

export const MenuSideBar: FC = () => {
  return (
    <aside className={ styles.menuSideBar__container }>
      <div className={ styles.menuSideBar__asideSlideOut }>
        <div className={ styles.menuSideBar__logoContainer }>
          <img
            className={ styles.menuSideBar__logo }
            src='/img/cheems-logo.png'
          />
        </div>

        <div className={ styles.menuSideBar__menuContainer }>
          <div
            className={ `
            ${styles.menuSideBar__menuItem }
            ${styles.menuSideBar__menuItemActive }
            ` }
          >
            <span className={ styles.menuSideBar__menuItemContent }>
              <BsHouse className={ styles.menuSideBar__menuItemIcon }/>
              <p className={ styles.menuSideBar__menuItemText }>
                Home
              </p>
            </span>
          </div>

          <div className={ styles.menuSideBar__menuItem }>
            <span className={ styles.menuSideBar__menuItemContent }>
              <BsClipboardCheck className={ styles.menuSideBar__menuItemIcon }/>
              <p className={ styles.menuSideBar__menuItemText }>
                Following
              </p>
            </span>
          </div>

          <div className={ styles.menuSideBar__menuItem }>
            <span className={ styles.menuSideBar__menuItemContent }>
              <BsBookmarks className={ styles.menuSideBar__menuItemIcon }/>
              <p className={ styles.menuSideBar__menuItemText }>
                Saved
              </p>
            </span>
          </div>

          <div className={ styles.menuSideBar__menuItem }>
            <span className={ styles.menuSideBar__menuItemContent }>
              <BsHeart className={ styles.menuSideBar__menuItemIcon }/>
              <p className={ styles.menuSideBar__menuItemText }>
                Reacted
              </p>
            </span>
          </div>

          <div className={ styles.menuSideBar__menuItem }>
            <span className={ styles.menuSideBar__menuItemContent }>
              <BsClock className={ styles.menuSideBar__menuItemIcon }/>
              <p className={ styles.menuSideBar__menuItemText }>
                Check Later
              </p>
            </span>
          </div>

          <div className={ styles.menuSideBar__menuItem }>
            <span className={ styles.menuSideBar__menuItemContent }>
              <BsCameraVideo className={ styles.menuSideBar__menuItemIcon }/>
              <p className={ styles.menuSideBar__menuItemText }>
                Live Cams
              </p>
            </span>
          </div>

        </div>

        <div className={ styles.menuSideBar__footerContainer }>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={'/'}
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={'/'}
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={'/'}
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={'/'}
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={'/'}
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={'/'}
          >
            Home
          </Link>
        </div>

        <div className={ styles.menuSideBar__copyrightContainer}>
          Cheems © 2023. Made with ❤️ by CP.
        </div>

      </div>
    </aside>
  )
}