import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import styles from './Login.module.scss'
import { z } from 'zod'

export interface Props {
  modal: {
    setOpenModal: Dispatch<SetStateAction<boolean>>
    setOpenRegisterModal: Dispatch<SetStateAction<boolean>>
    setOpenRetrievePasswordModal: Dispatch<SetStateAction<boolean>>
  } | null
}

export const Login: FC<Props> = ({ modal }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<boolean>(false)
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
  const passwordValidator = z.string().min(6)
  const emailValidator = z.string().email()

  const router = useRouter()
  const query = router.query
  const callbackUrl = query.callbackUrl ?? '/'

  const handleSignUpButton = () => {
    modal?.setOpenRegisterModal(true)
  }

  const handleForgotPasswordButton = () => {
    modal?.setOpenRetrievePasswordModal(true)
  }

  const onSubmit = async (event: FormEvent) => {
    setLoginError(false)
    event.preventDefault()

    if (password === '' || email === '') {
      return
    }

    const result = await signIn('credentials', { redirect: false, password, email })

    console.log(result)

    if (result?.error) {
      setLoginError(true)
    } else {
      if (modal !== null) {
        modal.setOpenModal(false)
      } else {
        await router.push(`${callbackUrl}`)
      }
    }
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setEmail('')
      setInvalidEmail(false)

      return
    }

    try {
      emailValidator.parse(event.target.value)
      setEmail(event.target.value)
      setInvalidEmail(false)
    } catch (exception: unknown) {
      setInvalidEmail(true)
      setEmail('')
    }
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setPassword('')
      setInvalidPassword(false)

      return
    }

    try {
      passwordValidator.parse(event.target.value)
      setPassword(event.target.value)
      setInvalidPassword(false)
    } catch (exception: unknown) {
      setInvalidPassword(true)
      setPassword('')
    }
  }

  return (
    <form
      className={ styles.login__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.login__title }>
        Login

        <small className={ styles.login__subtitle }>
          Inicia sesión con tu correo y contraseña.
        </small>
      </h1>

      <p className={ `
          ${styles.login__error}
          ${loginError ? styles.login__error__open : ''}
        ` }
      >
        User/password incorrectos
      </p>

      <div className={ styles.login__inputSection }>
        <label className={ styles.login__inputLabel }>
          Email
        </label>
        <input
          type={ 'email' }
          className={ `
            ${styles.login__input}
            ${invalidEmail ? styles.login__input_error : ''}
          ` }
          placeholder={ 'Email' }
          onChange={ handleEmailChange }
        />
        <label className={ `
          ${styles.login__inputErrorMessage}
          ${invalidEmail ? styles.login__inputErrorMessage__open : ''}
        ` }>
          El email no es válido
        </label>
      </div>

      <div className={ styles.login__inputSection }>
        <label className={ styles.login__inputLabel }>
          Password
        </label>
        <input
          className={ `
            ${styles.login__input}
            ${invalidPassword ? styles.login__input_error : ''}
          ` }
          placeholder={ 'Password' }
          type={ 'password' }
          onChange={ handlePasswordChange }
        />
        <label className={ `
          ${styles.login__inputErrorMessage}
          ${invalidPassword ? styles.login__inputErrorMessage__open : ''}
        ` }>
          La contraseña no es válida
        </label>
      </div>
      <button
        type="submit"
        className={ `
          ${styles.login__submit}
          ${!invalidEmail &&
            !invalidPassword &&
            email !== '' &&
            password !== ''
            ? styles.login__submit__enabled
              : ''}
        ` }
        disabled={ invalidEmail || invalidPassword }
      >
        { 'Iniciar sesión' }
      </button>

      <div className={ styles.login__registerRecoverSection }>
        <button
          className={ styles.login__signupButton }
          onClick={ handleSignUpButton }
        >
          Registrate aquí
        </button>

        <button
          className={ styles.login__forgotPasswordButton }
          onClick={ handleForgotPasswordButton }
        >
          Recupera tu contraseña
        </button>
      </div>
    </form>
  )
}
