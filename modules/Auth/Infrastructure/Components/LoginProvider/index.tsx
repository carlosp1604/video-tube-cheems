import { FC, ReactElement, useState } from 'react'
import { LoginContext } from '~/hooks/LoginContext'

const LoginProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)

  return (
    <LoginContext.Provider value={ { loginModalOpen, setLoginModalOpen } }>
      { children }
    </LoginContext.Provider>
  )
}

export default LoginProvider
