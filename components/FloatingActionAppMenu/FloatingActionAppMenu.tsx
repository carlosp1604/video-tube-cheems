import { Dispatch, FC, SetStateAction } from 'react'
import styles from './FloatingActionAppMenu.module.scss'
import { BsGrid3X3Gap } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'

interface Props {
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
}

export const FloatingActionAppMenu: FC<Props> = ({ openMenu, setOpenMenu }) => {
  const { t } = useTranslation('menu')

  return (

      <motion.div
        drag={ 'y' }
        whileHover={ { scale: 1.1 } }
        style={ {
          position: 'fixed',
          left: 12,
          top: 60,
          display: 'flex',
          zIndex: 100,
        } }
        dragConstraints={ {
          top: 0,
          bottom: ,
        } }
      >
        <button
          className={ 'rounded-full bg-base-500' }
          onClick={ () => {
            setOpenMenu(!openMenu)
          } }
          title={ t('menu_button_title') }
        >
          <BsGrid3X3Gap className={ styles.floatingActionAppMenu__icon }/>
        </button>
    </motion.div>

  )
}
