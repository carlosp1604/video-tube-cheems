import styles from './PostData.module.scss'
import { FC, ReactElement, useState } from 'react'
import Link from 'next/link'
import {
  PostComponentDtoActorDto,
  PostComponentDtoProducerDto, PostComponentDtoTagDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import useTranslation from 'next-translate/useTranslation'
import { TagList } from '~/modules/Posts/Infrastructure/Components/TagList/TagList'

export interface Props {
  producer: PostComponentDtoProducerDto | null
  actor: PostComponentDtoActorDto | null
  postActors: PostComponentDtoActorDto[]
  postTags: PostComponentDtoTagDto[]
  postDescription: string
}

export const PostData: FC<Props> = ({
  producer,
  actor,
  postActors,
  postTags,
  postDescription,
}) => {
  const { t } = useTranslation('post')
  const [extraDataOpen, setExtraDataOpen] = useState<boolean>(false)

  let producerSection: ReactElement | null = null
  let collaborationSection: ReactElement | null = null

  if (producer !== null) {
    producerSection = (
      <div className={ styles.postData__producerSection }>
        <Link
          href={ `/producers/${producer.slug}` }
          title={ producer.name }
          className={ styles.postData__producerLink }
        >
          <AvatarImage
            imageUrl={ producer.imageUrl }
            avatarClassName={ styles.postData__producerActorAvatar }
            imageClassName={ styles.postData__producerActorLogo }
            avatarName={ producer.name }
            imageAlt={ producer.name }
            color={ producer.brandHexColor }
          />
          { producer.name }
        </Link>
      </div>
    )
  }

  if (producer === null && actor !== null) {
    producerSection = (
      <div className={ styles.postData__producerSection }>
        <Link
          href={ `/actors/${actor.slug}` }
          title={ actor.name }
          className={ styles.postData__producerLink }
        >
          <AvatarImage
            imageUrl={ actor.imageUrl }
            avatarClassName={ styles.postData__producerActorAvatar }
            imageClassName={ styles.postData__producerActorLogo }
            avatarName={ actor.name }
            imageAlt={ actor.name }
          />
          { actor.name }
        </Link>
      </div>

    )
  }

  if (producer !== null && actor !== null) {
    collaborationSection = (
      <div className={ styles.postData__dataItem }>
        { t('post_extra_data_collaborator_section') }
        <div className={ styles.postData__producerSection }>
          <Link
            href={ `/actors/${actor.slug}` }
            className={ styles.postData__producerLink }
            title={ actor.name }
          >
            <AvatarImage
              imageUrl={ actor.imageUrl }
              avatarClassName={ styles.postData__producerActorAvatar }
              imageClassName={ styles.postData__producerActorLogo }
              avatarName={ actor.name }
              imageAlt={ actor.name }
            />
            { actor.name }
          </Link>
        </div>
      </div>
    )
  }

  let actorsSection: ReactElement | null = null
  let tagsSection: ReactElement | null = null
  let descriptionSection: ReactElement | null = null

  if (postActors.length > 0) {
    actorsSection = (
      <div className={ styles.postData__dataItem }>
        { t('post_extra_data_actors_title') }
        <div className={ styles.postData__actorsContainer }>
          { postActors.map((actor) => {
            const avatarSection: ReactElement = (
              <AvatarImage
                imageUrl={ actor.imageUrl }
                avatarClassName={ styles.postData__actorAvatar }
                imageClassName={ styles.postData__actorLogo }
                avatarName={ actor.name }
                imageAlt={ actor.name }
              />
            )

            return (
              <Link
                href={ `/actors/${actor.slug}` }
                className={ styles.postData__actorsItemLink }
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
      <div className={ styles.postData__dataItem }>
        { t('post_extra_data_tags_title') }
        <TagList tags={ postTags } />
      </div>
    )
  }

  if (postDescription !== '') {
    const descriptionFragments = postDescription.split(/\\n/)

    const descriptionParagraphs: ReactElement[] = []

    for (const fragment of descriptionFragments) {
      descriptionParagraphs.push(
        <div className={ styles.postData__postDescription } key={ fragment }>
          { fragment }
        </div>
      )
    }

    descriptionSection = (
      <div className={ styles.postData__dataItem }>
        { t('post_extra_data_description_title') }
        { descriptionParagraphs }
      </div>
    )
  }

  let producerActorSection: ReactElement | null = null

  if (producerSection) {
    producerActorSection = producerSection
  }

  return (
    <div className={ styles.postData__container }>
      { producerActorSection }
      <div className={ `
        ${styles.postData__postExtraData}
        ${extraDataOpen ? styles.postData__postExtraData__open : ''}
      ` }>
        { collaborationSection }
        { actorsSection }
        { tagsSection }
        { descriptionSection }
      </div>

      <div className={ styles.postData__showInfoSection }>
        <button
          className={ styles.postData__showInfoButton }
          onClick={ () => setExtraDataOpen(!extraDataOpen) }
          title={ extraDataOpen ? t('post_extra_data_section_show_less') : t('post_extra_data_section_show_more') }
        >
          { extraDataOpen ? t('post_extra_data_section_show_less') : t('post_extra_data_section_show_more') }
        </button>
      </div>
    </div>
  )
}
