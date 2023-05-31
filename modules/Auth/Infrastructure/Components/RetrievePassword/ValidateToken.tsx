import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './RetrievePassword.module.scss'
import { z } from 'zod'

export interface Props {
  email: string
  onConfirm: (token: string) => void
}

export const ValidateToken: FC<Props> = ({ email, onConfirm }) => {
  const [token, setToken] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('El token no es válido')
  const [invalidToken, setInvalidToken] = useState<boolean>(false)
  const [validationError, setValidationError] = useState<boolean>(false)
  const tokenValidator = z.string().min(8)

  const onSubmit = async (event: FormEvent) => {
    setValidationError(false)
    event.preventDefault()

    if (token === '') {
      return
    }

    try {
      const result = await fetch(`/api/auth/users/validate-token?email=${email}&token=${token}`)

      if (!result.ok) {
        if (result.status === 409) {
          setErrorMessage('Token expirado')
          setValidationError(true)

          return
        }

        if (result.status === 404) {
          setErrorMessage('El token no es válido')
          setValidationError(true)

          return
        }

        setErrorMessage('Servicio no disponible. Inténtalo más tarde')
        setValidationError(true)

        return
      }

      onConfirm(token)
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage('Servicio no disponible. Inténtalo más tarde')
      setValidationError(true)
    }
  }

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setToken('')
      setInvalidToken(false)

      return
    }

    try {
      tokenValidator.parse(event.target.value)
      setToken(event.target.value)
      setInvalidToken(false)
    } catch (exception: unknown) {
      setInvalidToken(true)
      setToken('')
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
          Introduce el token recibido en tu dirección de correo.
        </small>
      </h1>

      <p className={ `
          ${styles.retrievePassword__error}
          ${validationError ? styles.retrievePassword__error__open : ''}
        ` }
      >
        { errorMessage }
      </p>

      <div className={ styles.retrievePassword__inputSection }>
        <label className={ styles.retrievePassword__inputLabel }>
          Token
        </label>
        <input
          type={ 'text' }
          className={ `
            ${styles.retrievePassword__input}
            ${invalidToken ? styles.retrievePassword__input_error : ''}
          ` }
          placeholder={ 'Token' }
          onChange={ handleTokenChange }
        />
        <label className={ `
          ${styles.retrievePassword__inputErrorMessage}
          ${invalidToken ? styles.retrievePassword__inputErrorMessage__open : ''}
        ` }>
          Invalid token
        </label>
      </div>

      <button
        type="submit"
        className={ `
          ${styles.retrievePassword__submit}
          ${!invalidToken && token !== ''
          ? styles.retrievePassword__submit__enabled
          : ''}
        ` }
        disabled={ invalidToken }
      >
        { 'Enviar Token' }
      </button>
    </form>
  )
}
