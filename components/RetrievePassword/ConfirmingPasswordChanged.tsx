import { FC } from 'react'
import styles from './RetrievePassword.module.scss'
import { BsCheckCircle } from 'react-icons/bs'

export interface Props {
  onConfirm: () => void
}

export const ConfirmingPasswordChanged: FC<Props> = ({ onConfirm }) => {
  return (
    <div className={ styles.retrievePassword__confirmingRegister }>
      <BsCheckCircle className={ styles.retrievePassword__confirmingRegisterIcon }/>
        La contraseña del usuario se ha cambiado correctamente
      <button
        className={ styles.retrievePassword__confirmingRegisterButton }
        onClick={ () => onConfirm() }
      >
        Back to login
      </button>
    </div>
  )
}
