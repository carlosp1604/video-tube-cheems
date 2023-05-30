import { FC } from 'react'
import styles from './TagList.module.scss'
import Link from 'next/link'
import { TagComponentDto } from '~/modules/Posts/Infrastructure/Dtos/TagComponentDto'

interface Props {
  tags: TagComponentDto[]
}

export const TagList: FC<Props> = ({ tags }) => {
  return (
    <div className={ styles.tagList__container }>
      { tags.map((tag) => {
        return (
          <Link
            className={ styles.tagList__tagContainer }
            href={ `/tags/${tag.id}` }
            key={ tag.id }
          >
            { tag.name }
          </Link>
        )
      }) }
    </div>
  )
}
