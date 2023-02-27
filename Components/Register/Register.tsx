import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import styles from './Register.module.scss'
import { z } from 'zod'

export interface Props {
  modal: {
    setOpenModal: Dispatch<SetStateAction<boolean>>
  } | null
}

export const Register: FC<Props> = ({ modal }) => {
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
  }

  const handleForgotPasswordButton = () => {
  }

  const onSubmit = async (event: FormEvent) => {
    setLoginError(false)
    event.preventDefault()

    if (password === '' || email === '') {
      return
    }

    const result = await signIn('credentials', {
      redirect: false,
      password,
      email,
      callbackUrl: `${callbackUrl}`,
    })

    if (result?.error) {
      setLoginError(true)
    }
    else {
      if (modal !== null) {
        modal.setOpenModal(false)
      }
      else {
        router.push(`${callbackUrl}`)
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
    }
    catch (exception: unknown) {
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
    }
    catch (exception: unknown) {
      setInvalidPassword(true)
      setPassword('')
    }
  }

  return (
    <form
      className={styles.register__container}
      onSubmit={onSubmit}
    >
      <h1 className={styles.register__title}>
        Registo

        <small className={styles.register__subtitle}>
          Crea una cuenta en la plataforma   asda asdasdas.
        </small>
      </h1>

      <p className={`
          ${styles.register__error}
          ${loginError ? styles.register__error__open : ''}
        `}
      >
        User/password incorrectos
      </p>

      <div className={styles.register__inputSection}>
        <label className={styles.register__inputLabel}>
          Username
        </label>
        <input
          type={'text'}
          className={`
            ${styles.register__input}
            ${invalidEmail ? styles.register__input__error : ''}
          `}
          placeholder={'Email'}
          onChange={handleEmailChange}
        />
        <label className={`
          ${styles.register__inputErrorMessage}
          ${invalidEmail ? styles.register__inputErrorMessage__open : ''}
        `}>
          Username no válido
        </label>
      </div>

      <div className={styles.register__inputSection}>
        <label className={styles.register__inputLabel}>
          Email
        </label>
        <input
          type={'email'}
          className={`
            ${styles.register__input}
            ${invalidEmail ? styles.register__input__error : ''}
          `}
          placeholder={'Email'}
          onChange={handleEmailChange}
        />
        <label className={`
          ${styles.register__inputErrorMessage}
          ${invalidEmail ? styles.register__inputErrorMessage__open : ''}
        `}>
          Username no válido
        </label>
      </div>

      <div className={styles.register__inputSection}>
        <label className={styles.register__inputLabel}>
          Password
        </label>
        <input
          className={`
            ${styles.register__input}
            ${invalidPassword ? styles.register__input__error : ''}
          `}
          placeholder={'Password'}
          type={'password'}
          onChange={handlePasswordChange}
        />
        <label className={`
          ${styles.register__inputErrorMessage}
          ${invalidPassword ? styles.register__inputErrorMessage__open : ''}
        `}>
          La contraseña no es válida
        </label>
      </div>

      <div className={styles.register__inputSection}>
        <label className={styles.register__inputLabel}>
          Repetir Password
        </label>
        <input
          className={`
            ${styles.register__input}
            ${invalidPassword ? styles.register__input__error : ''}
          `}
          placeholder={'Repetir Password'}
          type={'password'}
          onChange={handlePasswordChange}
        />
        <label className={`
          ${styles.register__inputErrorMessage}
          ${invalidPassword ? styles.register__inputErrorMessage__open : ''}
        `}>
          Las contraseñas no coinciden
        </label>
      </div>

      <button 
        type="submit" 
        className={`
          ${styles.register__submit}
          ${!invalidEmail && 
            !invalidPassword &&
            email !== '' &&
            password !== '' 
            ? styles.register__submit__enabled : ''}
        `}
        disabled={invalidEmail || invalidPassword}
      >
        {'Iniciar sesión'}
      </button>

      <div className={styles.register__registerRecoverSection}>
        <button 
          className={styles.register__signupButton}
          onClick={handleSignUpButton}
        >
          Registrate aquí
        </button>
        
        <button 
          className={styles.register__forgotPasswordButton}
          onClick={handleForgotPasswordButton}
        >
          Recupera tu contraseña
        </button>
      </div>
    </form>
  )
}