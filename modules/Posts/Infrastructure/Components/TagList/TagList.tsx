import { FC } from 'react'
import styles from './TagList.module.scss'
import Link from 'next/link'
import { PostPostTagComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostPostTagComponentDto'

interface Props {
  tags: PostPostTagComponentDto[]
}

export const TagList: FC<Props> = ({ tags }) => {
  return (
    <div className={ styles.tagList__container }>
      { tags.map((tag) => {
        return (
          <Link
            className={ styles.tagList__tagContainer }
            href={ `/tags/${tag.slug}` }
            key={ tag.slug }
          >
            { tag.name }
          </Link>
        )
      }) }
    </div>
  )
}
