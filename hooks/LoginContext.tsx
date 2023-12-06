import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react'
import { AuthMode } from '~/modules/Auth/Infrastructure/Components/Login/LoginModal'

export interface LoginState {
  loginModalOpen: boolean
  setLoginModalOpen: Dispatch<SetStateAction<boolean>>
  mode: AuthMode
  setMode: Dispatch<SetStateAction<AuthMode>>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const LoginContext = createContext<LoginState>(null)

export const useLoginContext = (): LoginState => {
  const loginContext = useContext(LoginContext)

  if (!loginContext) {
    throw new Error(
      'useLoginContext() can only be used inside of <LoginProvider />'
    )
  }

  const { loginModalOpen, setLoginModalOpen, mode, setMode } = loginContext

  return useMemo<LoginState>(() => {
    return { loginModalOpen, setLoginModalOpen, mode, setMode }
  }, [loginModalOpen, setLoginModalOpen, mode, setMode])
}
