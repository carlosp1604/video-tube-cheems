import useTranslation from 'next-translate/useTranslation'
import { Error } from '~/components/Error/Error'

export default function Custom404 () {
  const { t } = useTranslation('error')

  return (
    <Error
      title={ t('404_error_page_title') }
      subtitle={ t('404_error_page_subtitle') }
      imageUrl={ '/img/cheems-tracksuit.png' }
      imageAlt={ t('404_error_page_image_alt') }
      actionButtonTitle={ t('404_error_page_button_title') }
    />
  )
}
