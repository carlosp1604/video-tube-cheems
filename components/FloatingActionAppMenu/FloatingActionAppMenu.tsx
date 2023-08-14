import { Dispatch, FC, SetStateAction } from 'react'
import styles from './FloatingActionAppMenu.module.scss'
import { BsGrid3X3Gap } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'

interface Props {
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
}

export const FloatingActionAppMenu: FC<Props> = ({ openMenu, setOpenMenu }) => {
  const { t } = useTranslation('menu')

  return (
    <button
      className={ styles.floatingActionAppMenu__container }
      onClick={ () => {
        setOpenMenu(!openMenu)
      } }
      title={ t('menu_button_title') }
    >
      <BsGrid3X3Gap className={ styles.floatingActionAppMenu__icon }/>
    </button>
  )
}
