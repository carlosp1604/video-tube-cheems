import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react'

export interface LoginState {
  loginModalOpen: boolean
  setLoginModalOpen: Dispatch<SetStateAction<boolean>>
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

  const { loginModalOpen, setLoginModalOpen } = loginContext

  return useMemo<LoginState>(() => {
    return { loginModalOpen, setLoginModalOpen }
  }, [loginModalOpen, setLoginModalOpen])
}
