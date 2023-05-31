import { useSession } from 'next-auth/react'
import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import { UserApplicationDto } from '../../../Application/Dtos/UserApplicationDto'
import { UserProviderUserDto } from '../../UserProviderUserDto'
import { UserProviderUserDtoTranslator } from '../../UserProviderUserDtoTranslator'
import { UserContext } from '~/hooks/UserContext'
import { UserStatus } from '~/types/UserProviderInstance'

const UserProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [status, setStatus] = useState<UserStatus>('SIGNED_OUT')
  const [user, setUser] = useState<UserProviderUserDto | null>(null)
  const session = useSession()
  const fetchUser = async (): Promise<UserProviderUserDto | null> => {
    try {
      const authUser: UserApplicationDto = await (await fetch('/api/auth')).json()

      if (authUser) {
        return UserProviderUserDtoTranslator.fromApplication(authUser)
      }

      return null
    } catch (exception: unknown) {
      console.error('UserProvider: Failed to fetch user data')
      console.error(exception)

      return null
    }
  }

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const authenticatedUser = await fetchUser()

      if (authenticatedUser !== null) {
        setUser(authenticatedUser)
        setStatus('SIGNED_IN')
      }
    }

    if (session.status === 'authenticated' && status !== 'SIGNED_IN') {
      getUser()
        .catch((reason) => {
          console.log('UserProvider: getUser() could not update authenticated user data')
          console.log(reason)
        })
    }

    if (
      session.status === 'unauthenticated' &&
      status === 'SIGNED_IN'
    ) {
      setUser(null)
      setStatus('SIGNED_OUT')
    }
  }, [session, setUser, setStatus, status])

  const userInstance = useMemo(() => ({
    user,
    status,
    updateUser: async (): Promise<void> => {
      if (session.status !== 'authenticated') {
        return
      }

      const updatedUser = await fetchUser()

      setUser(updatedUser)
    },
  }), [session.status, status, user])

  return (
    <UserContext.Provider value={ { userInstance } }>
      { children }
    </UserContext.Provider>
  )
}

export default UserProvider
