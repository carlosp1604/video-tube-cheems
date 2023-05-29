import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
import { z } from 'zod'

export interface Props {
  email: string
  token: string
  onConfirm: () => void
}

export const RegisterUser: FC<Props> = ({ email, token, onConfirm }) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordRepeat, setPasswordRepeat] = useState<string>('')
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false)
  const [invalidName, setInvalidName] = useState<boolean>(false)
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState<boolean>(false)
  const [userCreationError, setUserCreationError] = useState<boolean>(false)

  const usernameValidator = z.string().min(4).max(36).regex(/^[a-zA-Z0-9_]+$/)
  const passwordValidator = z.string().min(8)
  const nameValidator = z.string().min(1)

  const onSubmit = async (event: FormEvent) => {
    setUserCreationError(false)
    event.preventDefault()

    if (token === '') {
      return
    }

    try {
      const result = await fetch('/api/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          username,
          // FIXME: -----
          language: 'es',
          token,
        }),
      })

      if (!result.ok) {
        if (result.status === 409) {
          setErrorMessage('Usuario ya existe. Comprueba tu email/nombre de usuario.')
          setUserCreationError(true)

          return
        }

        if (result.status === 422) {
          setErrorMessage('El token no es válido')
          setUserCreationError(true)

          return
        }

        setErrorMessage('Servicio no disponible. Inténtalo más tarde')
        setUserCreationError(true)

        return
      }

      onConfirm()
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage('Servicio no disponible. Inténtalo más tarde')
      setUserCreationError(true)
    }
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setName('')
      setInvalidName(false)

      return
    }

    try {
      nameValidator.parse(event.target.value)
      setName(event.target.value)
      setInvalidName(false)
    } catch (exception: unknown) {
      setInvalidName(true)
      setName('')
    }
  }

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setUsername('')
      setInvalidUsername(false)

      return
    }

    try {
      usernameValidator.parse(event.target.value)
      setUsername(event.target.value)
      setInvalidUsername(false)
    } catch (exception: unknown) {
      setInvalidUsername(true)
      setUsername('')
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
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.register__title }>
        Registro

        <small className={ styles.register__subtitle }>
          Introduce tus datos de usuario para la cuenta { email }
        </small>
      </h1>

      <p className={ `
          ${styles.register__error}
          ${userCreationError ? styles.register__error__open : ''}
        ` }
      >
        { errorMessage }
      </p>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          Name
        </label>
        <input
          type={ 'text' }
          className={ `
            ${styles.register__input}
            ${invalidName ? styles.register__input__error : ''}
          ` }
          placeholder={ 'Name' }
          onChange={ handleNameChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${invalidName ? styles.register__inputErrorMessage__open : ''}
        ` }>
          Invalid name
        </label>
      </div>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          Username
        </label>
        <input
          type={ 'text' }
          className={ `
            ${styles.register__input}
            ${invalidUsername ? styles.register__input__error : ''}
          ` }
          placeholder={ 'Username' }
          onChange={ handleUsernameChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${invalidUsername ? styles.register__inputErrorMessage__open : ''}
        ` }>
          Invalid username
        </label>
      </div>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          Password
        </label>
        <input
          type={ 'password' }
          className={ `
            ${styles.register__input}
            ${invalidPassword ? styles.register__input__error : ''}
          ` }
          placeholder={ 'Password' }
          onChange={ handlePasswordChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${invalidPassword ? styles.register__inputErrorMessage__open : ''}
        ` }>
          Invalid password
        </label>
      </div>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          Retype password
        </label>
        <input
          type={ 'password' }
          className={ `
            ${styles.register__input}
            ${passwordDoesNotMatch ? styles.register__input__error : ''}
          ` }
          placeholder={ 'Password' }
          onChange={ handlePasswordRepeatChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${passwordDoesNotMatch ? styles.register__inputErrorMessage__open : ''}
        ` }>
          Password does not match
        </label>
      </div>

      <button
        type="submit"
        className={ `
          ${styles.register__submit}
          ${
            !invalidName && name !== '' &&
            !invalidUsername && username !== '' &&
            !invalidPassword && password !== '' &&
            !passwordDoesNotMatch && passwordRepeat !== ''
          ? styles.register__submit__enabled
          : ''}
        ` }
      >
        { 'Registro' }
      </button>
    </form>
  )
}
