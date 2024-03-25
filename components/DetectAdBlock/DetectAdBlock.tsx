import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AppToastDismissible } from '~/components/AppToast/AppToastDismissible'
import { useTranslation } from 'next-i18next'

export interface Props {
  adblockDetected: boolean
}

export const DetectAdBlock: FC<Props> = ({ adblockDetected }) => {
  const { t } = useTranslation('common')
  const [closed, setClosed] = useState<boolean>(false)

  useEffect(() => {
    if (adblockDetected && !closed) {
      toast((initialToast) =>
        (<AppToastDismissible
            onClose={ () => setClosed(true) }
            message={ t('ad_blocker_detected_message_title') }
            initialToast={ initialToast }
          />),
      { duration: Infinity, position: 'top-right' }
      )
    }
  })

  return <></>
}
