import { FC } from 'react'
import styles from './TagList.module.scss'
import { TagComponentDto } from '../Dtos/TagComponentDto'
import Link from 'next/link'

interface Props {
  tags: TagComponentDto[]
}

export const TagList: FC<Props> = ({ tags }) => {
  return (
    <div className={ styles.tagList__container }>
      { tags.map((tag) => {
        return (
          <Link href={`/tags/${tag.id}`}>
            <div 
              className={ styles.tagList__tagContainer }
              key={ tag.id }  
            >
            { tag.name }
            </div>
          </Link>
        )
      })}
    </div>
  )
}