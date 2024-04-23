import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import { TagPageComponentDto } from '~/modules/PostTag/Infrastructure/TagPageComponentDto'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { Tag } from '~/modules/PostTag/Infrastructure/Components/Tag/Tag'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import { useAvatarColor } from '~/hooks/AvatarColor'
import styles from './TagPage.module.scss'
import { useRouter } from 'next/router'

export interface TagPageProps {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  tag: TagPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const TagPage: NextPage<TagPageProps> = ({
  initialPage,
  initialOrder,
  tag,
  initialPosts,
  initialPostsNumber,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t } = useTranslation('tag_page')
  const locale = useRouter().locale ?? 'en'
  const getRandomColor = useAvatarColor()
  const tagColor = getRandomColor(tag.name)

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: tag.name,
      item: `${baseUrl}/${locale}/tags/${tag.slug}`,
    }],
  }

  let canonicalUrl = `${baseUrl}/tags/${tag.slug}`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/tags/${tag.slug}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('tag_page_title', { tagName: tag.name }),
      t('tag_page_description', { tagName: tag.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <div className={ styles.tagPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      { /* TODO: Add imageAlt when tags have imageUrl */ }
      <ProfileHeader
        name={ tag.name }
        imageAlt={ '' }
        imageUrl={ null }
        customColor={ tagColor }
        rounded={ false }
      />

      <Tag
        initialPage={ initialPage }
        initialOrder={ initialOrder }
        tag={ tag }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
      />
    </div>
  )
}
