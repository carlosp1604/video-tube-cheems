import { FC } from 'react'
import styles from './Register.module.scss'
import { BsCheckCircle } from 'react-icons/bs'

export interface Props {
  onConfirm: () => void
}

export const ConfirmingRegister: FC<Props> = ({ onConfirm }) => {
  return (
    <div className={ styles.register__confirmingRegister }>
      <BsCheckCircle className={ styles.register__confirmingRegisterIcon }/>
        Usuario registrado correctamente
      <button
        className={ styles.register__confirmingRegisterButton }
        onClick={ () => onConfirm() }
      >
        Back to login
      </button>
    </div>
  )
}
