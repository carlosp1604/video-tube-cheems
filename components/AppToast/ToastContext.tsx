import { Context, createContext, useContext, useMemo } from 'react'
import { ToastType } from '~/components/AppToast/Toast'

interface ToastContextState {
  success: (content: string, id?: string) => void
  error: (content: string, id?: string) => void
  dismissible: (content: string, type: ToastType, id?: string) => void
  remove: (id: string) => void
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ToastContext: Context<ToastContextState> = createContext(null)

export const useToast = (): ToastContextState => {
  const toastContext = useContext(ToastContext)

  if (!toastContext) {
    throw new Error(
      'useToast() can only be used inside of <ToastProvider />'
    )
  }

  const { remove, dismissible, success, error } = toastContext

  return useMemo<ToastContextState>(() => {
    return { remove, dismissible, success, error }
  }, [remove, dismissible, success, error])
}
