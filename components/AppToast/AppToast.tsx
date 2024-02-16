import { FC } from 'react'
import { Toaster } from 'react-hot-toast'

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
          secondary: process.env.NEXT_PUBLIC_TOAST_SECONDARY ?? '',
          primary: process.env.NEXT_PUBLIC_TOAST_PRIMARY ?? '',
        },
        error: {
          className: 'rounded-lg bg-toast-error text-white px-2 py-1 shadow-lg shadow-body',
          iconTheme: {
            secondary: process.env.NEXT_PUBLIC_TOAST_ERROR_SECONDARY ?? '',
            primary: process.env.NEXT_PUBLIC_TOAST_ERROR_PRIMARY ?? '',
          },
        },
      } }
    />
  )
}
