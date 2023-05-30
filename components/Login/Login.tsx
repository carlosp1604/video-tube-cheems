import { signIn } from 'next-auth/react'
import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './Login.module.scss'
import { emailValidator, passwordValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'

export interface Props {
  onClickSignup: () => void
  onClickForgotPassword: () => void
  onSuccessLogin: () => void
}

export const Login: FC<Props> = ({ onClickSignup, onClickForgotPassword, onSuccessLogin }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<boolean>(false)
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)

  const onSubmit = async (event: FormEvent) => {
    setLoginError(false)
    event.preventDefault()

    if (password === '' || email === '') {
      return
    }

    const result = await signIn('credentials', { redirect: false, password, email })

    if (result?.error) {
      setLoginError(true)
    } else {
      onSuccessLogin()
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
      ` }>
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
          onClick={ onClickSignup }
        >
          Registrate aquí
        </button>

        <button
          className={ styles.login__forgotPasswordButton }
          onClick={ onClickForgotPassword }
        >
          Recupera tu contraseña
        </button>
      </div>
    </form>
  )
}
