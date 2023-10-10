import styles from './PostExtraData.module.scss'
import { FC, ReactElement, useState } from 'react'
import {
  PostComponentDtoActorDto, PostComponentDtoTagDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from 'next/link'
import Avatar from 'react-avatar'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { TagList } from '~/modules/Posts/Infrastructure/Components/TagList/TagList'

export interface Props {
  postActors: PostComponentDtoActorDto[]
  postTags: PostComponentDtoTagDto[]
  postDescription: string
}

export const PostExtraData: FC<Props> = ({
  postActors,
  postTags,
  postDescription,
}) => {
  const [extraDataOpen, setExtraDataOpen] = useState<boolean>(false)

  const { t } = useTranslation('post')

  let actorsSection: ReactElement | null = null
  let tagsSection: ReactElement | null = null
  let descriptionSection: ReactElement | null = null

  if (postActors.length > 0) {
    actorsSection = (
      <div className={ styles.postExtraData__dataItem }>
        { t('post_extra_data_actors_title') }
        <div className={ styles.postExtraData__actorsContainer }>
          { postActors.map((actor) => {
            let avatarSection: ReactElement

            if (actor.imageUrl !== null) {
              avatarSection = (
                <Image
                  className={ styles.postExtraData__actorLogo }
                  src={ actor.imageUrl }
                  alt={ actor.name }
                  width={ 0 }
                  height={ 0 }
                  sizes={ '100vw' }
                />
              )
            } else {
              avatarSection = (
                <Avatar
                  round={ true }
                  size={ '40' }
                  name={ actor.name }
                />
              )
            }

            return (
              <Link
                href={ '/' }
                className={ styles.postExtraData__actorsItemLink }
                key={ actor.id }
              >
                { avatarSection }
                { actor.name }
              </Link>
            )
          }) }
        </div>
      </div>
    )
  }

  if (postTags.length > 0) {
    tagsSection = (
      <div className={ styles.postExtraData__dataItem }>
        { t('post_extra_data_tags_title') }
        <TagList tags={ postTags } />
      </div>
    )
  }

  if (postDescription !== '') {
    descriptionSection = (
      <div className={ styles.postExtraData__dataItem }>
        { t('post_extra_data_description_title') }
        <div className={ styles.postExtraData__postDescription }>
          { postDescription }
        </div>
      </div>
    )
  }

  return (
    <section className={ styles.postExtraData__container }>
      <div className={ `
        ${styles.postExtraData__postExtraData}
        ${extraDataOpen ? styles.postExtraData__postExtraData__open : ''}
      ` }
      >
        { actorsSection }
        { tagsSection }
        { descriptionSection }
      </div>
      <div
        className={ `
          ${styles.postExtraData__extraDataButtonContainer}
          ${extraDataOpen ? styles.postExtraData__extraDataButtonContainer_open : ''}
        ` }
      >
        <button className={ `
          ${styles.postExtraData__extraDataButton}
          ${extraDataOpen ? styles.postExtraData__extraDataButton_open : ''}
        ` }
          onClick={ () => setExtraDataOpen(!extraDataOpen) }
        >
          { extraDataOpen
            ? t('post_extra_data_section_hide')
            : t('post_extra_data_section_show_more')
          }
          { extraDataOpen
            ? <BsChevronUp className={ styles.postExtraData__extraDataIcon }/>
            : <BsChevronDown className={ styles.postExtraData__extraDataIcon }/>
          }
        </button>
      </div>
    </section>
  )
}
