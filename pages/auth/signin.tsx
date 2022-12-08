import { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'

const SignInPage: NextPage = () => {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/',
    })
  }

  return (
    <>
      <form
        onSubmit={ onSubmit }
      >
        <h1
        >
          { 'ASDASD' }
        </h1>
        <label
        >
          { 'ALSDSO' }
          <div
          >
            <input
              type='email'
              name='email'
              placeholder={ 'email' }
              onChange={ (event) => {
                setEmail(event.target.value)
              }}
            />
            <input
              type='password'
              name='password'
              placeholder={ 'password' }
              onChange={ (event) => {
                setPassword(event.target.value)
              }}
            />
          </div>
        </label>
        <button
          data-qa='sign-in-button'
        >
          {'SigIn'}
        </button>
      </form>
    </>
  )
}

export default SignInPage
