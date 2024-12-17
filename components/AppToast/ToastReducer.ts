import { Toast } from '~/components/AppToast/Toast'

export type Action<T = Toast, I = string> =
  { type: 'add'; toast: T } |
  { type: 'delete'; toastId: I }

export interface ToastState {
  toasts: Toast []
}

export const toastReducer = (state: ToastState, action: Action) => {
  switch (action.type) {
    case 'add': {
      const toastIndex = state.toasts.findIndex((toast) => action.toast.id === toast.id)

      if (toastIndex !== -1) {
        const updatedToasts = state.toasts

        updatedToasts[toastIndex] = action.toast

        return {
          ...state,
          toasts: updatedToasts,
        }
      }

      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      }
    }

    case 'delete': {
      const updatedToasts = state.toasts.filter(
        (toast) => toast.id !== action.toastId
      )

      return {
        ...state,
        toasts: updatedToasts,
      }
    }

    default:
      throw new Error('Unhandled action type')
  }
}
