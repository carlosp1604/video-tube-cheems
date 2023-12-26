import styles from './Error.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

export interface Props {
  title: string
  subtitle: string
  imageUrl: string
  imageAlt: string
  actionButtonTitle: string
}

export const Error: FC<Props> = ({ title, subtitle, imageUrl, imageAlt, actionButtonTitle }) => {
  return (
    <div className={ styles.error__container }>
      <Image
        src={ imageUrl }
        alt={ imageAlt }
        className={ styles.error__image }
        width={ 0 }
        height={ 0 }
        sizes={ '100vw' }
      />
      <div className={ styles.error__messageContainer }>
        <h1 className={ styles.error__title }>
          { title }
        </h1>
        <span className={ styles.error__subtitle }>
          { subtitle }
        </span>
        <Link
          href={ '/' }
          className={ styles.error__backToHomeLink }
        >
          { actionButtonTitle }
        </Link>
      </div>
    </div>
  )
}
