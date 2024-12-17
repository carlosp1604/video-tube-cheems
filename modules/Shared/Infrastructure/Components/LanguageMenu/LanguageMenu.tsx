import styles from './LanguageMenu.module.scss'
import { FC, useState } from 'react'
import { MenuOptions } from '~/components/MenuOptions/MenuOptions'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { IoLanguageOutline } from 'react-icons/io5'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'
import dynamic from 'next/dynamic'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { useToast } from '~/components/AppToast/ToastContext'

const Modal = dynamic(() =>
  import('~/components/Modal/Modal').then((module) => module.Modal),
{ ssr: false }
)

export interface Props {
  isOpen: boolean
  onClose: () => void
}

export const LanguageMenu: FC<Props> = ({ isOpen, onClose }) => {
  const [languageMenuToastId] = useState<string>(uuidv4())

  const { t } = useTranslation('menu')
  const { error } = useToast()

  const { pathname, query, asPath, push } = useRouter()
  const locale = useRouter().locale ?? 'en'

  const onClickOption = async (currentLocale: string, newLocale: string) => {
    if (currentLocale !== newLocale) {
      await push({ pathname, query }, asPath, { locale: newLocale, scroll: false })
      onClose()
    } else {
      error(t('language_menu_already_on_language_error_message'), languageMenuToastId)
    }
  }

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
    >
      <div className={ styles.languageMenu__container }>
        <ModalMenuHeader
          title={ t('language_menu_title') }
          subtitle={ t('language_menu_subtitle') }
          icon={ <IoLanguageOutline /> }
        />
        <div className={ styles.languageMenu__menuOptionsContainer }>
          <MenuOptions menuOptions={ [{
            title: t('language_menu_spanish_option_title'),
            action: undefined,
            picture: (
              <Image
                alt={ t('language_menu_spanish_option_title') }
                className={ styles.languageMenu__optionImage }
                src={ '/img/es-locale.svg' }
                width={ 200 }
                height={ 200 }
                sizes={ '100vw' }
                placeholder={ 'blur' }
                blurDataURL={ rgbDataURL(81, 80, 80) }
              />
            ),
            isActive: locale === 'es',
            onClick: () => onClickOption(locale, 'es'),
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
            onClick: () => onClickOption(locale, 'en'),
          },
          ] } />
        </div>
      </div>
    </Modal>
  )
}
