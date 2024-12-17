import styles from './PostData.module.scss'
import { FC, ReactElement, useState } from 'react'
import Link from 'next/link'
import {
  PostComponentDtoActorDto,
  PostComponentDtoProducerDto, PostComponentDtoTagDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { MdOutlineLiveTv } from 'react-icons/md'
import { BsStarFill } from 'react-icons/bs'

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
      <div className={ styles.postData__dataItemContainer }>
        { t('post_data_producer_title') }
        <Link
          prefetch={ false }
          className={ styles.postData__listItemContainer }
          href={ `/producers/${producer.slug}` }
          title={ producer.name }
        >
          <MdOutlineLiveTv className={ styles.postData__producerActorIcon }/>
          { producer.name }
        </Link>
      </div>
    )
  }

  if (producer === null && actor !== null) {
    producerSection = (
      <div className={ styles.postData__dataItemContainer }>
        { t('post_data_actor_title') }
        <Link
          prefetch={ false }
          className={ styles.postData__listItemContainer }
          href={ `/actors/${actor.slug}` }
          title={ actor.name }
        >
          <BsStarFill className={ styles.postData__producerActorIcon }/>
          { actor.name }
        </Link>
      </div>
    )
  }

  if (producer !== null && actor !== null) {
    collaborationSection = (
      <div className={ styles.postData__dataItem }>
        <div className={ styles.postData__dataItemContainer }>
          { t('post_data_collaborator_title') }
          <Link
            prefetch={ false }
            className={ styles.postData__listItemContainer }
            href={ `/actors/${actor.slug}` }
            title={ actor.name }
          >
            <BsStarFill />
            { actor.name }
          </Link>
        </div>
      </div>
    )
  }

  let actorsSection: ReactElement | null = null
  let categorySection: ReactElement | null = null
  let descriptionSection: ReactElement | null = null

  if (postActors.length > 0) {
    actorsSection = (
      <div className={ styles.postData__dataItem }>
        <div className={ styles.postData__dataItemContainer }>
          { t('post_extra_data_actors_title') }
          <div className={ styles.postData__overflowContainer }>
            { postActors.map((actor) => {
              return (
                <Link
                  prefetch={ false }
                  key={ actor.id }
                  className={ styles.postData__listItemContainer }
                  href={ `/actors/${actor.slug}` }
                  title={ actor.name }
                >
                  <BsStarFill className={ styles.postData__producerActorIcon }/>
                  { actor.name }
                </Link>
              )
            }) }
          </div>
        </div>
      </div>
    )
  }

  if (postTags.length > 0) {
    categorySection = (
      <div className={ styles.postData__dataItem }>
        <div className={ styles.postData__dataItemContainer }>
          { t('post_extra_data_tags_title') }
          <div className={ styles.postData__overflowContainer }>
            { postTags.map((tag) => {
              return (
                <Link
                  prefetch={ false }
                  className={ styles.postData__listItemContainer }
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
        <div className={ styles.postData__dataItemContainer }>
          { t('post_extra_data_description_title') }
          { descriptionParagraphs }
        </div>

      </div>
    )
  }

  return (
    <div className={ styles.postData__container }>
      <div className={ styles.postData__dataItem }>
        <div className={ styles.postData__mainDataContainer }>
          { producerSection ?? <div className={ styles.postData__dataItemContainerEmpty }/> }

          <div className={ styles.postData__dataItemContainer }>
            { t('post_data_published_title') }
            <span className={ styles.postData__dataItemContent }>
              { date }
            </span>
          </div>

          <div className={ styles.postData__dataItemContainer }>
            { t('post_data_views_title') }
            <span className={ styles.postData__dataItemContent }>
              { viewsNumber }
            </span>
          </div>
          { collaborationSection ?? <div className={ styles.postData__dataItemContainerEmpty }/> }
        </div>
      </div>

      { showExtraData ? actorsSection : null }
      { showExtraData ? categorySection : null }
      { showExtraData ? descriptionSection : null }
      <CommonButton
        title={ showExtraData ? t('post_extra_data_section_show_less') : t('post_extra_data_section_show_more') }
        disabled={ false }
        onClick={ () => setShowExtraData(!showExtraData) }
      />
    </div>
  )
}
