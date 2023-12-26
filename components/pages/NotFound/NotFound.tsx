import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { Error } from '~/components/Error/Error'

export const NotFound: NextPage = () => {
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
