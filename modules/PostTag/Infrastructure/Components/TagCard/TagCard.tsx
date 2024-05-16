import { FC } from 'react'
import { TagCardComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagCardComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import Link from 'next/link'
import styles from './TagCard.module.scss'

export interface Props {
  tagCardDto: TagCardComponentDto
}
export const TagCard: FC<Props> = ({ tagCardDto }) => {
  return (
    <div className={ styles.tagCard__container }>
      <Link
        href={ `/tags/${tagCardDto.slug}` }
        title={ tagCardDto.name }
        className={ styles.tagCard__link }
      >
        <AvatarImage
          imageUrl={ tagCardDto.imageUrl }
          avatarClassName={ styles.tagCard__avatarContainer }
          imageClassName={ styles.tagCard__imageContainer }
          avatarName={ tagCardDto.name }
          imageAlt={ tagCardDto.name }
          rounded={ false }
        />
        <span className={ styles.tagCard__nameContainer }>
          { tagCardDto.name }
        </span>
      </Link>
    </div>
  )
}
