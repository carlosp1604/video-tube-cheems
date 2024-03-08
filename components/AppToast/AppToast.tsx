import { FC } from 'react'
import { Toaster } from 'react-hot-toast'
import tailwindConfig from '~/tailwind.config.js'

export const AppToast: FC = () => {
  return (
    <Toaster
      position={ 'top-center' }
      containerStyle={ {
        marginTop: '40px',
      } }
      toastOptions={ {
        className: 'rounded-lg bg-toast-bg text-white px-2 py-1 shadow-lg shadow-body',
        iconTheme: {
          secondary: tailwindConfig.theme.extend.colors.white,
          primary: tailwindConfig.theme.extend.colors.toast.icon,
        },
        error: {
          className: 'rounded-lg bg-toast-error-bg text-white px-2 py-1 shadow-lg shadow-body',
          iconTheme: {
            secondary: tailwindConfig.theme.extend.colors.white,
            primary: tailwindConfig.theme.extend.colors.toast.error.icon,
          },
        },
      } }
    />
  )
}
