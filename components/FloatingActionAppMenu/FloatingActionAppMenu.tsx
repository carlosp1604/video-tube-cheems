import { Dispatch, FC, SetStateAction } from 'react'
import styles from './FloatingActionAppMenu.module.scss'
import { BsGrid3X3Gap } from 'react-icons/bs'

interface Props {
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
}

export const FloatingActionAppMenu: FC<Props> = ({ openMenu, setOpenMenu }) => {
  return (
    <section
      className={ styles.floatingActionAppMenu__container }
      onClick={ () => {
        setOpenMenu(!openMenu)
      } }>
      <BsGrid3X3Gap className={ styles.floatingActionAppMenu__icon }/>
    </section>
  )
}
