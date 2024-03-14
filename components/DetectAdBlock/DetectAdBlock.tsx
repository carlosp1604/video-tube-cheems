import React, { FC } from 'react'
import { useDetectAdBlock } from 'adblock-detect-react'
import toast from 'react-hot-toast'
import { AppToastDismissible } from '~/components/AppToast/AppToastDismissible'
import { useTranslation } from 'next-i18next'

export const DetectAdBlock: FC = () => {
  const { t } = useTranslation('common')

  const adBlockDetected = useDetectAdBlock()

  React.useEffect(() => {
    if (adBlockDetected) {
      toast((initialToast) =>
        (<AppToastDismissible message={ t('ad_blocker_detected_message_title') } initialToast={ initialToast } />),
      { duration: Infinity, position: 'top-right' }
      )
    }
  }, [])

  return <></>
}
