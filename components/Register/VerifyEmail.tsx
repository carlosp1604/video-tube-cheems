import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
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
      const result = await fetch('/api/auth/users/verify-email', {
        method: 'POST',
        body: JSON.stringify({
          email,
          sendNewToken: resendEmail,
        }),
      })

      if (!result.ok) {
        if (result.status === 409) {
          const jsonResponse = await result.json()

          if (jsonResponse.code === 'verify-email-address-conflict-token-already-issued') {
            setResendEmail(true)
            setErrorMessage('Email ya enviado. Revisa tu bandeja de entrada.')
          } else {
            setErrorMessage('Email no disponible')
          }
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
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.register__title }>
        Registro

        <small className={ styles.register__subtitle }>
          Introduce un email válido. Será necesario para activar la cuenta y recuperar tu contraseña.
        </small>
      </h1>

      <p className={ `
          ${styles.register__error}
          ${verificationError ? styles.register__error__open : ''}
        ` }
      >
        { errorMessage }
      </p>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          Email
        </label>
        <input
          type={ 'email' }
          className={ `
            ${styles.register__input}
            ${invalidEmail ? styles.register__input_error : ''}
          ` }
          placeholder={ 'Email' }
          onChange={ handleEmailChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${invalidEmail ? styles.register__inputErrorMessage__open : ''}
        ` }>
          { 'Invalid email' }
        </label>
      </div>

      <button
        type="submit"
        className={ `
          ${styles.register__submit}
          ${!invalidEmail && email !== ''
          ? styles.register__submit__enabled
          : ''}
          ${resendEmail ? styles.register__submit_resendEmail : ''}
        ` }
      >
        { resendEmail ? '¿No recibido? Reenviar email' : 'Enviar email' }
      </button>
      <button className={ `
        ${styles.register__verificationCodeLink}
        ${!invalidEmail && email !== ''
          ? styles.register__verificationCodeLink_active
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
