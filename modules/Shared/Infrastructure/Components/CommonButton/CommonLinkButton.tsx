import { FC, HTMLAttributeAnchorTarget, ReactElement } from 'react'
import styles from './CommonButton.module.scss'
import Link, { LinkProps } from 'next/link'

type CommonButtonCallback = () => void

export interface Props {
  title: string
  linksProps: LinkProps
}

export interface OptionalProps {
  onClick: CommonButtonCallback
  icon: ReactElement
  target: HTMLAttributeAnchorTarget
  rel: string
  border: boolean
}

export const CommonButtonLink: FC<Props & Partial<OptionalProps>> = ({
  title,
  linksProps,
  onClick = undefined,
  icon = undefined,
  border = false,
  target,
  rel,
}) => {
  return (
    <Link
      className={ `
        ${styles.commonButton__container} ${border ? styles.commonButton__withBorder : ''}
      ` }
      title={ title }
      onClick={ onClick }
      { ... linksProps }
      { ...target ? { target } : {} }
      { ...rel ? { rel } : {} }
    >
      { icon }
      { title }
    </Link>
  )
}
