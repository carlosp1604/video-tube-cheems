import { FC, ReactElement, useEffect, useState } from 'react'
import styles from './LikeButton.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import * as uuid from 'uuid'
import { Tooltip } from '~/components/Tooltip/Tooltip'
import { AiOutlineLoading } from 'react-icons/ai'
import toast from 'react-hot-toast'

interface Props {
  liked: boolean
  onLike: () => Promise<void>
  onDeleteLike: () => Promise<void>
  reactionsNumber: number
  disabled: boolean
}

export const LikeButton: FC<Props> = ({ liked, onLike, onDeleteLike, reactionsNumber, disabled }) => {
  const { t } = useTranslation('common')
  let { locale } = useRouter()
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuid.v4())
  }, [])

  locale = locale || 'en'

  const onClickButton = async () => {
    if (loading || disabled) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    if (liked) {
      await onDeleteLike()
    } else {
      await onLike()
    }

    setLoading(false)
  }

  let iconElement: ReactElement

  if (!loading) {
    if (liked) {
      iconElement = (
        <BiSolidLike className={ styles.likeButton__likeIcon }
         title={ t('like_reaction_active_title_button') }
         data-tooltip-id={ tooltipId }
         data-tooltip-content={ t('like_reaction_active_title_button') }
        />
      )
    } else {
      iconElement = (
        <BiLike className={ styles.likeButton__likeIcon }
          title={ t('like_reaction_title_button') }
          data-tooltip-id={ tooltipId }
          data-tooltip-content={ t('like_reaction_title_button') }
        />
      )
    }
  } else {
    iconElement = (<AiOutlineLoading className={ styles.likeButton__loadingIcon } />)
  }

  return (
    <div className={ `
      ${styles.likeButton__container}
      ${disabled ? styles.likeButton__container_disabled : ''}
    ` }>
      <button className={ `
        ${styles.likeButton__likeButton}
        ${liked ? styles.likeButton__likeButton_active : ''}
      ` }
        disabled={ disabled }
        onClick={ onClickButton }
      >
        { iconElement }
      </button>

      { mounted && !disabled && !loading &&
        <Tooltip
          tooltipId={ tooltipId }
          place={ 'top' }
        /> }
      { NumberFormatter.compatFormat(reactionsNumber, locale) }
    </div>
  )
}
