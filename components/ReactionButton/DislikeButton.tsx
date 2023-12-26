import { FC, ReactElement, useEffect, useState } from 'react'
import styles from './DislikeButton.module.scss'
import { useTranslation } from 'next-i18next'
import { BiDislike, BiSolidDislike } from 'react-icons/bi'
import * as uuid from 'uuid'
import { Tooltip } from '~/components/Tooltip/Tooltip'
import { AiOutlineLoading } from 'react-icons/ai'
import toast from 'react-hot-toast'

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

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuid.v4())
  }, [])

  const onClickButton = async () => {
    if (loading || disabled) {
      toast.error(t('action_cannot_be_performed_error_message'))

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
          data-tooltip-content={ t('dislike_reaction_active_title_button') }
        />
      )
    } else {
      iconElement = (
        <BiDislike
          className={ styles.dislikeButton__dislikeIcon }
          data-tooltip-id={ tooltipId }
          data-tooltip-content={ t('dislike_reaction_title_button') }
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
        /> }
    </div>
  )
}
