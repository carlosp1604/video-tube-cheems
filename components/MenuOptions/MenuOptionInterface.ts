import { ReactElement } from 'react'

export interface MenuOptionInterface {
  isActive: boolean
  translationKey: string
  action: string
  icon: ReactElement
  onClick: (() => void) | undefined
}
