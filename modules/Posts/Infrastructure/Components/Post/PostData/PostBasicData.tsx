import styles from './PostBasicData.module.scss'
import { FC } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { useTranslation } from 'next-i18next'
import { BsChatSquareText } from 'react-icons/bs'
import { BiDislike, BiLike } from 'react-icons/bi'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { useRouter } from 'next/router'

export interface Props {
  post: PostComponentDto
  postViewsNumber: number
  postLikes: number
  postDislikes: number
  postCommentsNumber: number
}

export const PostBasicData: FC<Props> = ({
  post,
  postViewsNumber,
  postLikes,
  postDislikes,
  postCommentsNumber,
}) => {
  const { t } = useTranslation('post')

  let { locale } = useRouter()

  locale = locale ?? 'en'

  return (
    <div className={ styles.postBasicData__container } key={ post.id }>
      <h1 className={ styles.postBasicData__postTitle }>
        { post.title }
      </h1>
      <div className={ styles.postBasicData__postInfo }>
        <span className={ styles.postBasicData__postInfoItem }>
          { post.date }
        </span>
        <span className={ styles.postBasicData__postInfoItem }>
          { t('post_views_title', { views: NumberFormatter.compatFormat(postViewsNumber, locale) }) }
        </span>
        <span className={ styles.postBasicData__postInfoItem }>
          { NumberFormatter.compatFormat(postLikes, locale) }
          <BiLike />
        </span>
        <span className={ styles.postBasicData__postInfoItem }>
          { NumberFormatter.compatFormat(postDislikes, locale) }
          <BiDislike />
        </span>
        <span className={ styles.postBasicData__postInfoItem }>
          { NumberFormatter.compatFormat(postCommentsNumber, locale) }
          <BsChatSquareText />
        </span>
      </div>
    </div>
  )
}
