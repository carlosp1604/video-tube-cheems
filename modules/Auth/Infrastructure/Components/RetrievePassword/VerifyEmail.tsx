import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './RetrievePassword.module.scss'
import { z } from 'zod'

export interface Props {
  onConfirm: (email: string) => void
}

export const VerifyEmail: FC<Props> = ({ onConfirm }) => {
  const [email, setEmail] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('Email no disponible')
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [verificationError, setVerificationError] = useState<boolean>(false)
  const [resendEmail, setResendEmail] = useState<boolean>(false)
  const emailValidator = z.string().email()

  const onSubmit = async (event: FormEvent) => {
    setVerificationError(false)
    event.preventDefault()

    if (email === '') {
      return
    }

    try {
      const result = await fetch('/api/auth/users/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          sendNewToken: resendEmail,
        }),
      })

      if (!result.ok) {
        if (result.status === 409) {
          setResendEmail(true)
          setErrorMessage('Email ya enviado. Revisa tu bandeja de entrada.')
          setVerificationError(true)

          return
        }

        if (result.status === 400) {
          setErrorMessage('Email inválido')
          setVerificationError(true)

          return
        }

        if (result.status === 422) {
          setErrorMessage('No se pudo enviar el email')
          setVerificationError(true)

          return
        }

        setErrorMessage('Servicio no disponible. Inténtalo más tarde')
        setVerificationError(true)

        return
      }

      onConfirm(email)
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage('Servicio no disponible. Inténtalo más tarde')
      setVerificationError(true)
    }
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setResendEmail(false)
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

  return (
    <form
      className={ styles.retrievePassword__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.retrievePassword__title }>
        Recuperar contraseña

        <small className={ styles.retrievePassword__subtitle }>
          Introduce el email con el que creaste tu cuenta de usuario. Te enviaremos un código para comprobar tu identidad.
        </small>
      </h1>

      <p className={ `
          ${styles.retrievePassword__error}
          ${verificationError ? styles.retrievePassword__error__open : ''}
        ` }
      >
        { errorMessage }
      </p>

      <div className={ styles.retrievePassword__inputSection }>
        <label className={ styles.retrievePassword__inputLabel }>
          Email
        </label>
        <input
          type={ 'email' }
          className={ `
            ${styles.retrievePassword__input}
            ${invalidEmail ? styles.retrievePassword__input_error : ''}
          ` }
          placeholder={ 'Email' }
          onChange={ handleEmailChange }
        />
        <label className={ `
          ${styles.retrievePassword__inputErrorMessage}
          ${invalidEmail ? styles.retrievePassword__inputErrorMessage__open : ''}
        ` }>
          { 'Invalid email' }
        </label>
      </div>

      <button
        type="submit"
        className={ `
          ${styles.retrievePassword__submit}
          ${!invalidEmail && email !== ''
          ? styles.retrievePassword__submit__enabled
          : ''}
          ${resendEmail ? styles.retrievePassword__submit_resendEmail : ''}
        ` }
      >
        { resendEmail ? '¿No recibido? Reenviar email' : 'Enviar email' }
      </button>
      <button className={ `
        ${styles.retrievePassword__verificationCodeLink}
        ${!invalidEmail && email !== ''
        ? styles.retrievePassword__verificationCodeLink_active
        : ''}
      ` }
              onClick={ () => {
                if (email !== '' && !invalidEmail) {
                  onConfirm(email)
                }
              } }
              disabled={ invalidEmail }
      >
        Tengo un código de verificación
      </button>
    </form>
  )
}
