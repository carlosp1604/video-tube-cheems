import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './RetrievePassword.module.scss'
import { z } from 'zod'

export interface Props {
  email: string
  token: string
  onConfirm: () => void
}

export const ChangeUserPassword: FC<Props> = ({ email, token, onConfirm }) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordRepeat, setPasswordRepeat] = useState<string>('')
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState<boolean>(false)
  const [passwordChangeError, setPasswordChangeError] = useState<boolean>(false)

  const passwordValidator = z.string().min(8)

  const onSubmit = async (event: FormEvent) => {
    setPasswordChangeError(false)
    event.preventDefault()

    if (token === '') {
      return
    }

    try {
      const result = await fetch('/api/auth/users/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          token,
        }),
      })

      if (!result.ok) {
        if (result.status === 404) {
          setErrorMessage('No se encuentra el usuario asociado al correo indicado')
          setPasswordChangeError(true)

          return
        }

        if (result.status === 422) {
          setErrorMessage('El token no es válido')
          setPasswordChangeError(true)

          return
        }

        setErrorMessage('Servicio no disponible. Inténtalo más tarde')
        setPasswordChangeError(true)

        return
      }

      onConfirm()
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage('Servicio no disponible. Inténtalo más tarde')
      setPasswordChangeError(true)
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

  const handlePasswordRepeatChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setPasswordRepeat('')
      setInvalidPassword(false)

      return
    }

    if (password === event.target.value) {
      setPasswordRepeat(event.target.value)
      setPasswordDoesNotMatch(false)
    } else {
      setPasswordDoesNotMatch(true)
      setPasswordRepeat('')
    }
  }

  return (
    <form
      className={ styles.retrievePassword__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.retrievePassword__title }>
        Recuperar contraseña

        <small className={ styles.retrievePassword__subtitle }>
          Introduce una nueva contraseña para tu cuenta { email }
        </small>
      </h1>

      <p className={ `
          ${styles.retrievePassword__error}
          ${passwordChangeError ? styles.retrievePassword__error__open : ''}
        ` }
      >
        { errorMessage }
      </p>

      <div className={ styles.retrievePassword__inputSection }>
        <label className={ styles.retrievePassword__inputLabel }>
          Password
        </label>
        <input
          type={ 'password' }
          className={ `
            ${styles.retrievePassword__input}
            ${invalidPassword ? styles.retrievePassword__input__error : ''}
          ` }
          placeholder={ 'Password' }
          onChange={ handlePasswordChange }
        />
        <label className={ `
          ${styles.retrievePassword__inputErrorMessage}
          ${invalidPassword ? styles.retrievePassword__inputErrorMessage__open : ''}
        ` }>
          Invalid password
        </label>
      </div>

      <div className={ styles.retrievePassword__inputSection }>
        <label className={ styles.retrievePassword__inputLabel }>
          Retype password
        </label>
        <input
          type={ 'password' }
          className={ `
            ${styles.retrievePassword__input}
            ${passwordDoesNotMatch ? styles.retrievePassword__input__error : ''}
          ` }
          placeholder={ 'Password' }
          onChange={ handlePasswordRepeatChange }
        />
        <label className={ `
          ${styles.retrievePassword__inputErrorMessage}
          ${passwordDoesNotMatch ? styles.retrievePassword__inputErrorMessage__open : ''}
        ` }>
          Password does not match
        </label>
      </div>

      <button
        type="submit"
        className={ `
          ${styles.retrievePassword__submit}
          ${
          !invalidPassword && password !== '' &&
          !passwordDoesNotMatch && passwordRepeat !== ''
            ? styles.retrievePassword__submit__enabled
            : ''}
        ` }
      >
        { 'Cambiar contraseña' }
      </button>
    </form>
  )
}
