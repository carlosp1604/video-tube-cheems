import { FC, useEffect, useState } from 'react'
import styles from './LikeButton.module.scss'
import { useTranslation } from 'next-i18next'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import * as uuid from 'uuid'
import { Tooltip } from '~/components/Tooltip/Tooltip'

interface Props {
  liked: boolean
  onLike: () => void
  onDeleteLike: () => void
  reactionsNumber: number
}

export const LikeButton: FC<Props> = ({ liked, onLike, onDeleteLike, reactionsNumber }) => {
  const { t } = useTranslation('common')
  let { locale } = useRouter()
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuid.v4())
  }, [])

  locale = locale || 'en'

  return (
    <div className={ styles.likeButton__container }>
      { liked
        ? <BiSolidLike className={ `
            ${styles.likeButton__likeIcon}
            ${styles.likeButton__likeIcon_active}
          ` }
          onClick={ () => onDeleteLike() }
          title={ t('like_reaction_active_title_button') }
          data-tooltip-id={ tooltipId }
          data-tooltip-content={ t('like_reaction_active_title_button') }
        />
        : <BiLike
          className={ styles.likeButton__likeIcon }
          onClick={ () => onLike() }
          title={ t('like_reaction_title_button') }
          data-tooltip-id={ tooltipId }
          data-tooltip-content={ t('like_reaction_title_button') }
        />
      }
      { mounted &&
        <Tooltip
          tooltipId={ tooltipId }
          place={ 'top' }
        /> }
      { NumberFormatter.compatFormat(reactionsNumber, locale) }
    </div>
  )
}
