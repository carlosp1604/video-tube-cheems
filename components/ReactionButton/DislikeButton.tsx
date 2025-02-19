import { FC, ReactElement, useEffect, useState } from 'react'
import styles from './DislikeButton.module.scss'
import useTranslation from 'next-translate/useTranslation'
import * as uuid from 'uuid'
import { Tooltip } from '~/components/Tooltip/Tooltip'
import { AiOutlineLoading } from 'react-icons/ai'
import { useToast } from '~/components/AppToast/ToastContext'
import { BiDislike, BiSolidDislike } from 'react-icons/bi'

interface Props {
  disliked: boolean
  onDislike: () => Promise<void>
  onDeleteDislike: () => Promise<void>
  disabled: boolean
}

export const DislikeButton: FC<Props> = ({ disliked, onDislike, onDeleteDislike, disabled }) => {
  const { t } = useTranslation('common')
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { error } = useToast()

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuid.v4())
  }, [])

  const onClickButton = async () => {
    if (loading || disabled) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    if (disliked) {
      await onDeleteDislike()
    } else {
      await onDislike()
    }

    setLoading(false)
  }

  let iconElement: ReactElement

  if (!loading) {
    if (disliked) {
      iconElement = (
        <BiSolidDislike
          className={ styles.dislikeButton__dislikeIcon }
          data-tooltip-id={ tooltipId }
        />
      )
    } else {
      iconElement = (
        <BiDislike
          className={ styles.dislikeButton__dislikeIcon }
          data-tooltip-id={ tooltipId }
        />
      )
    }
  } else {
    iconElement = (<AiOutlineLoading className={ styles.dislikeButton__loadingIcon } />)
  }

  return (
    <div className={ `
      ${styles.dislikeButton__container}
      ${disabled ? styles.dislikeButton__container_disabled : ''}
    ` }>
      <button className={ `
        ${styles.dislikeButton__dislikeButton}
        ${disliked ? styles.dislikeButton__dislikeButton_active : ''}
      ` }
        disabled={ disabled }
        onClick={ onClickButton }
      >
        { iconElement }
      </button>
      { mounted && !disabled && !loading &&
        <Tooltip
          tooltipId={ tooltipId }
          place={ 'bottom' }
          content={ disliked ? t('dislike_reaction_active_title_button') : t('dislike_reaction_title_button') }
        /> }
    </div>
  )
}
