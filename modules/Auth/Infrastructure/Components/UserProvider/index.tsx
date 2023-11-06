import { signOut, useSession } from 'next-auth/react'
import { UserStatus } from '~/types/UserProviderInstance'
import { UserContext } from '~/hooks/UserContext'
import { UserProviderUserDto } from '~/modules/Auth/Infrastructure/Dtos/UserProviderUserDto'
import { UserProviderUserDtoTranslator } from '~/modules/Auth/Infrastructure/Translators/UserProviderUserDtoTranslator'
import { FC, ReactElement, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next'

const UserProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const { t } = useTranslation('api_exceptions')
  const [status, setStatus] = useState<UserStatus>('SIGNED_OUT')
  const [user, setUser] = useState<UserProviderUserDto | null>(null)
  const session = useSession()
  const fetchUser = async (): Promise<UserProviderUserDto | null> => {
    try {
      const response = await fetch('/api/auth')

      if (!response.ok) {
        if (response.status === 404) {
          await signOut({ redirect: false })

          toast.error('user_not_found_error_message')
        }

        return null
      }

      const authUser = await response.json()

      return UserProviderUserDtoTranslator.fromApplication(authUser)

      return null
    } catch (exception: unknown) {
      console.error('UserProvider: Failed to fetch user data')
      console.error(exception)

      return null
    }
  }
  const getUser = async (): Promise<void> => {
    const authenticatedUser = await fetchUser()

    if (authenticatedUser !== null) {
      setStatus('SIGNED_IN')
      setUser(authenticatedUser)
    } else {
      if (user !== null && status === 'SIGNED_IN') {
        setUser(null)
        setStatus('SIGNED_OUT')
      }
    }
  }

  if (session.status === 'authenticated' && status === 'SIGNED_OUT') {
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

  const updateUser = useCallback(async () => {
    await getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userInstance = useMemo(() => ({
    user,
    status,
    updateUser,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    session.status,
    status,
    user,
  ])

  return (
    <UserContext.Provider value={ { userInstance } }>
      { children }
    </UserContext.Provider>
  )
}

export default UserProvider
