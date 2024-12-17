import { CSSProperties, FC, ReactElement, useRef, useState } from 'react'
import { DropdownMenuOption, DropdownMenuOptionProps } from './DropdownMenuOption/DropdownMenuOption'
import styles from './DropdownMenu.module.scss'
import { useClickOutside } from '~/hooks/ClickOutside'
import { useClickAnimation } from '~/hooks/ClickAnimation/ClickAnimation'

export type DropdownMenuPosition = 'left' | 'right'

export interface Props {
  title: string
  customButton: ReactElement
  icon: ReactElement
  options: DropdownMenuOptionProps[]
  position: DropdownMenuPosition
  closeOnClickOption: boolean
}

export const DropdownMenu: FC<Partial<Props> & Pick<Props, 'options' | 'title' >> = ({
  title,
  options,
  position = 'left',
  customButton = undefined,
  closeOnClickOption = true,
  icon = undefined,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef(null)

  const handleClickOutside = () => {
    if (open) {
      setOpen(false)
    }
  }

  useClickOutside(containerRef, handleClickOutside)
  useClickAnimation(buttonRef)

  let button = (
    <button
      ref={ buttonRef }
      className={ styles.dropdownMenu__button }
      onClick={ () => { setOpen(!open) } }
      title={ title }
    >
      { icon }
      { title }
    </button>
  )

  if (customButton) {
    button = (
      <span
        onClick={ () => { setOpen(!open) } }
        title={ title }
      >
        { customButton }
      </span>
    )
  }

  const onClickOption = (option: DropdownMenuOptionProps) => {
    if (option.onClick) {
      option.onClick()
    }

    if (closeOnClickOption) {
      setOpen(false)
    }
  }

  let positionStyles: Record<string, string> = {
    '--left-side': '0',
    '--right-side': 'auto',
  }

  if (position === 'right') {
    positionStyles = {
      '--left-side': 'auto',
      '--right-side': '0',
    }
  }

  return (
    <div className={ styles.dropdownMenu__container } ref={ containerRef }>
      { button }
      <div
        className={ `
          ${styles.dropdownMenu__dropdownMenuContainer} 
          ${open ? styles.dropdownMenu__dropdownMenuContainer__open : ''}
        ` }
        onMouseOver={ () => setOpen(true) }
        onMouseLeave={ () => setOpen(false) }
        style={ positionStyles as CSSProperties }
      >
        { options.map((option) => (
          <DropdownMenuOption
            key={ option.title }
            link={ option.link }
            title={ option.title }
            icon={ option.icon }
            onClick={ () => onClickOption(option) }
            active={ option.active }
          />
        )) }
      </div>
    </div>
  )
}
