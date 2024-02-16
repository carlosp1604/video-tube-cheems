import { FC } from 'react'
import { Toaster } from 'react-hot-toast'
import TailwindConfig from '~/tailwind.config'

export const AppToast: FC = () => {
  return (
    <Toaster
      position={ 'top-center' }
      containerStyle={ {
        marginTop: '40px',
      } }
      toastOptions={ {
        className: 'rounded-lg bg-toast-background text-white px-2 py-1 shadow-lg shadow-body',
        iconTheme: {
          secondary: TailwindConfig.theme.extend.colors.toast.secondary,
          primary: TailwindConfig.theme.extend.colors.toast.primary,
        },
        error: {
          className: 'rounded-lg bg-toast-error-background text-white px-2 py-1 shadow-lg shadow-body',
          iconTheme: {
            secondary: TailwindConfig.theme.extend.colors.toast.error.secondary,
            primary: TailwindConfig.theme.extend.colors.toast.error.primary,
          },
        },
      } }
    />
  )
}
