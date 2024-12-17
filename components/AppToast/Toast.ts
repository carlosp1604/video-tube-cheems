export type ToastType = 'error' | 'success'

export interface Toast {
  id: string
  type: ToastType
  content: string
  dismissible: boolean
  duration: number
  onRemove: () => void
}
