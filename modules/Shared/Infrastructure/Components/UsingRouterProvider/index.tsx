import { FC, ReactElement, useState } from 'react'
import { UsingRouterContext } from '~/hooks/UsingRouterContext'

const UsingRouterProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [blocked, setBlocked] = useState<boolean>(false)

  return (
    <UsingRouterContext.Provider value={ { blocked, setBlocked } }>
      { children }
    </UsingRouterContext.Provider>
  )
}

export default UsingRouterProvider
