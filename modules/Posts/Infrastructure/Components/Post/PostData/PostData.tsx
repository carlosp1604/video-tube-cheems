import styles from './PostData.module.scss'
import { FC, ReactElement, useState } from 'react'
import Link from 'next/link'
import {
  PostComponentDtoActorDto,
  PostComponentDtoProducerDto, PostComponentDtoTagDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { BsIncognito } from 'react-icons/bs'
import { ProducerActor } from '~/modules/Posts/Infrastructure/Components/Post/ProducerActor/ProducerActor'
import { RxCalendar } from 'react-icons/rx'

export interface Props {
  producer: PostComponentDtoProducerDto | null
  actor: PostComponentDtoActorDto | null
  postActors: PostComponentDtoActorDto[]
  postTags: PostComponentDtoTagDto[]
  postDescription: string
  date: string
  viewsNumber: number
}

export const PostData: FC<Props> = ({
  producer,
  actor,
  postActors,
  postTags,
  postDescription,
  date,
  viewsNumber,
}) => {
  const { t } = useTranslation('post')
  const [showExtraData, setShowExtraData] = useState<boolean>(false)

  let producerSection: ReactElement | null = null
  let collaborationSection: ReactElement | null = null

  if (producer !== null) {
    producerSection = (
      <div>
        <h2 className={ styles.postData__hiddenHeading }>{ t('post_data_producer_title') }</h2>
        <ProducerActor
          name={ producer.name }
          imageUrl={ producer.imageUrl }
          slug={ producer.slug }
          type={ 'producer' }
        />
      </div>
    )
  }

  if (producer === null && actor !== null) {
    producerSection = (
      <div>
        <h2 className={ styles.postData__hiddenHeading }>{ t('post_data_actor_title') }</h2>
        <ProducerActor
          name={ actor.name }
          imageUrl={ actor.imageUrl }
          slug={ actor.slug }
          type={ 'actor' }
        />
      </div>
    )
  }

  if (producer !== null && actor !== null) {
    collaborationSection = (
      <div>
        <h2 className={ styles.postData__hiddenHeading }>{ t('post_data_actor_title') }</h2>
        <ProducerActor
          name={ actor.name }
          imageUrl={ actor.imageUrl }
          slug={ actor.slug }
          type={ 'actor' }
        />
      </div>
    )
  }

  let actorsSection: ReactElement | null = null
  let categorySection: ReactElement | null = null
  let descriptionSection: ReactElement | null = null

  if (postActors.length > 0) {
    actorsSection = (
      <div className={ styles.postData__extraDataItem }>
        <h2>{ t('post_extra_data_actors_title') }</h2>
        <div className={ styles.postData__actorListContainer }>
          { postActors.map((actor) => {
            return (
              <ProducerActor
                key={ actor.slug }
                name={ actor.name }
                slug={ actor.slug }
                imageUrl={ actor.imageUrl }
                type={ 'actor' }
              />
            )
          }) }
        </div>
      </div>
    )
  }

  if (postTags.length > 0) {
    categorySection = (
      <div className={ styles.postData__extraDataItem }>
        <h2>{ t('post_extra_data_tags_title') }</h2>
        <div className={ styles.postData__listContainer }>
          { postTags.map((tag) => {
            return (
              <Link
                prefetch={ false }
                className={ styles.postData__tagItem }
                href={ `/tags/${tag.slug}` }
                key={ tag.slug }
                title={ tag.name }
              >
                { tag.name }
              </Link>
            )
          }) }
        </div>
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
      <div className={ styles.postData__extraDataItem }>
        <h2>{ t('post_extra_data_description_title') }</h2>
        { descriptionParagraphs }
      </div>
    )
  }

  return (
    <div className={ styles.postData__container }>
      <div className={ styles.postData__mainDataContainer }>
        <div className={ styles.postData__producerCollaboratorSection }>
          { producerSection }
          { collaborationSection }
        </div>
        <div className={ styles.postData__basicDataContainer }>
          <div className={ styles.postData__basicDataItem }>
            <RxCalendar/>
            { date }
          </div>
          <div className={ styles.postData__basicDataItem }>
            <BsIncognito/>
            { t('post_views_title', { views: viewsNumber }) }
          </div>
        </div>
      </div>
      <div className={ `
        ${styles.postData__extraDataContainer}
        ${showExtraData ? styles.postData__extraDataContainer_visible : ''}
      ` }>
        { actorsSection }
        { categorySection }
        { descriptionSection }
      </div>
      <div className={ styles.postData__extraSection }>
        <button
          onClick={ () => {
            setShowExtraData(!showExtraData)
          } }
          className={ styles.postData__extraButton }
        >
          { showExtraData ? t('post_extra_data_section_show_less') : t('post_extra_data_section_show_more') }
        </button>
      </div>
    </div>
  )
}
