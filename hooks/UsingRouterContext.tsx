import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react'

export interface RouterState {
  blocked: boolean
  setBlocked: Dispatch<SetStateAction<boolean>>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const UsingRouterContext = createContext<RouterState>(null)

export const useUsingRouterContext = (): RouterState => {
  const usingRouterContext = useContext(UsingRouterContext)

  if (!UsingRouterContext) {
    throw new Error(
      'useUsingRouterContext() can only be used inside of <UsingRouterContext />'
    )
  }

  const { blocked, setBlocked } = usingRouterContext

  return useMemo<RouterState>(() => {
    return { blocked, setBlocked }
  }, [blocked, setBlocked])
}
