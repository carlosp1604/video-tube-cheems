import { createContext, useContext, useMemo } from 'react'
import { UserInstance, UserProviderInstanceData } from '~/types/UserProviderInstance'

export const UserContext = createContext<UserProviderInstanceData>(null)

export const useUserContext = (): UserInstance => {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error(
      'useUserContext() can only be used inside of <UserProvider />'
    )
  }

  const { userInstance } = userContext

  return useMemo<UserInstance>(() => {
    return { ...userInstance }
  }, [userInstance])
}
