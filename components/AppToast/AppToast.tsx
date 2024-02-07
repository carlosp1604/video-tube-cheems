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
        className: 'rounded-lg bg-brand-700 text-base-100 px-2 py-1 shadow-lg shadow-body font-roboto',
        iconTheme: {
          secondary: '#FAFAF9',
          primary: '#b88b5c',
        },
        error: {
          className: 'rounded-lg bg-[#DC143C] text-white px-2 py-1 shadow-lg shadow-body font-roboto',
          iconTheme: {
            secondary: '#DC143C',
            primary: '#FFA07A',
          },
        },
      } }
    />
  )
}
