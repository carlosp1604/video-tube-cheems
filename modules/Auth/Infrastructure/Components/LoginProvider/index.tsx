import { FC, ReactElement, useState } from 'react'
import { LoginContext } from '~/hooks/LoginContext'
import { AuthMode } from '~/modules/Auth/Infrastructure/Components/Login/LoginModal'

const LoginProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<AuthMode>('login')

  return (
    <LoginContext.Provider value={ { loginModalOpen, setLoginModalOpen, mode, setMode } }>
      { children }
    </LoginContext.Provider>
  )
}

export default LoginProvider
