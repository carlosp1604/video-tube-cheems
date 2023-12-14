import { FC, useEffect, useState } from 'react'
import styles from './DislikeButton.module.scss'
import { useTranslation } from 'next-i18next'
import { BiDislike, BiSolidDislike } from 'react-icons/bi'
import * as uuid from 'uuid'
import { Tooltip } from '~/components/Tooltip/Tooltip'

interface Props {
  disliked: boolean
  onDislike: () => void
  onDeleteDislike: () => void
}

export const DislikeButton: FC<Props> = ({ disliked, onDislike, onDeleteDislike }) => {
  const { t } = useTranslation('common')
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuid.v4())
  }, [])

  return (
    <div className={ styles.dislikeButton__container }>
      { disliked
        ? <BiSolidDislike
          className={ `
            ${styles.dislikeButton__dislikeIcon}
            ${styles.dislikeButton__dislikeIcon_active}
        ` }
          onClick={ () => onDeleteDislike() }
          data-tooltip-id={ tooltipId }
          data-tooltip-content={ t('dislike_reaction_active_title_button') }
        />
        : <BiDislike
          className={ styles.dislikeButton__dislikeIcon }
          onClick={ () => onDislike() }
          data-tooltip-id={ tooltipId }
          data-tooltip-content={ t('dislike_reaction_title_button') }
        />
      }
      { mounted &&
        <Tooltip
          tooltipId={ tooltipId }
          place={ 'bottom' }
        /> }
    </div>
  )
}
