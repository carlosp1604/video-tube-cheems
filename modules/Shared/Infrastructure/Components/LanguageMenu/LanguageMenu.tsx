import styles from './LanguageMenu.module.scss'
import { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { IoLanguageOutline } from 'react-icons/io5'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import * as uuid from 'uuid'

export interface Props {
  isOpen: boolean
  onClose: () => void
}

export const LanguageMenu: FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('menu')

  const { pathname, query, asPath, locale, push } = useRouter()

  const languageMenuToastId = uuid.v4()

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
    >
      <div className={ styles.languageMenu__container }>
        <div className={ styles.languageMenu__titleSection }>
          <span className={ styles.languageMenu__iconWrapper }>
            <IoLanguageOutline className={ styles.languageMenu__icon }/>
          </span>
          <span className={ styles.languageMenu__title }>
            { t('language_menu_title') }
            <small className={ styles.languageMenu__subtitle }>
              { t('language_menu_subtitle') }
            </small>
          </span>
        </div>
        <div className={ styles.languageMenu__menuOptionsContainer }>
          <MenuOptions menuOptions={ [{
            title: t('language_menu_spanish_option_title'),
            action: undefined,
            picture: (
              <Image
                alt={ t('language_menu_spanish_option_title') }
                className={ styles.languageMenu__optionImage }
                src={ '/img/es-locale.svg' }
                width={ 0 }
                height={ 0 }
                sizes={ '100vw' }
              />
            ),
            isActive: locale === 'es',
            onClick: async () => {
              if (locale !== 'es') {
                await push({ pathname, query }, asPath, { locale: 'es', scroll: false })
                toast.remove(languageMenuToastId)
              } else {
                toast.error(t('language_menu_already_on_language_error_message'), { id: languageMenuToastId })
              }
            },
          },
          {
            title: t('language_menu_english_option_title'),
            action: undefined,
            picture: (
              <Image
                alt={ t('language_menu_english_option_title') }
                className={ styles.languageMenu__optionImage }
                src={ '/img/en-locale.svg' }
                width={ 0 }
                height={ 0 }
                sizes={ '100vw' }
              />
            ),
            isActive: locale === 'en',
            onClick: async () => {
              if (locale !== 'en') {
                await push({ pathname, query }, asPath, { locale: 'en', scroll: false })
                toast.remove(languageMenuToastId)
              } else {
                toast.error(t('language_menu_already_on_language_error_message'), { id: languageMenuToastId })
              }
            },
          },
          ] } />
        </div>
      </div>
    </Modal>
  )
}
