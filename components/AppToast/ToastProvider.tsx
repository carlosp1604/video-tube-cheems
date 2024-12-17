import { createRef, FC, ReactElement, Ref, useReducer } from 'react'
import { toastReducer, ToastState } from '~/components/AppToast/ToastReducer'
import { ToastType } from '~/components/AppToast/Toast'
import ToastsContainer, { ToastWithNodeRef } from '~/components/AppToast/ToastsContainer/ToastsContainer'
import { ToastContext } from '~/components/AppToast/ToastContext'
import { nanoid } from 'nanoid'

export interface ToastContextProps {
  children: ReactElement
}

export const ToastProvider: FC<ToastContextProps> = ({ children }) => {
  const initialState: ToastState = {
    toasts: [],
  }

  const [state, dispatch] = useReducer(toastReducer, initialState)

  const addToast = (
    type: ToastType,
    content: string,
    id: string | undefined = undefined,
    dismissible = false,
    duration = 5000
  ) => {
    let toastId: string

    if (id) {
      toastId = id
    } else {
      toastId = nanoid()
    }

    dispatch({
      type: 'add',
      toast: {
        id: toastId,
        content,
        type,
        duration,
        dismissible,
        onRemove: () => dispatch({ type: 'delete', toastId }),
      },
    })
  }

  const success = (content: string, id: string | undefined = undefined) => {
    addToast('success', content, id)
  }

  const error = (content: string, id: string | undefined = undefined) => {
    addToast('error', content, id)
  }

  const dismissible = (content: string, type: ToastType, id: string | undefined = undefined) => {
    addToast(type, content, id, true)
  }

  const remove = (id: string) => {
    dispatch({ type: 'delete', toastId: id })
  }

  const value = { success, error, dismissible, remove }

  const buildToastWithReference = (): ToastWithNodeRef[] => {
    return state.toasts.map((toast) => {
      const ref: Ref<HTMLDivElement> = createRef()

      return {
        toast,
        nodeRef: ref,
      }
    })
  }

  return (
    <ToastContext.Provider value={ value }>
      <ToastsContainer toasts={ buildToastWithReference() } />
      { children }
    </ToastContext.Provider>
  )
}
