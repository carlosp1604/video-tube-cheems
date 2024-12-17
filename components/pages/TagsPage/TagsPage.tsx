import { NextPage } from 'next'
import { TagCardComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagCardComponentDto'
import { Tags } from '~/modules/PostTag/Infrastructure/Components/Tags/Tags'
import { useRouter } from 'next/router'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import useTranslation from 'next-translate/useTranslation'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'

export interface Props {
  tagCards: TagCardComponentDto[]
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const TagsPage: NextPage<Props> = ({ tagCards, htmlPageMetaContextProps, baseUrl }) => {
  const locale = useRouter().locale ?? 'en'
  const { t } = useTranslation('tags')

  let canonicalUrl = `${baseUrl}/tags`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/tags`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('tags_page_title'),
      t('tags_page_description'),
      HtmlPageMetaContextResourceType.ARTICLE,
      canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <CrackrevenuePostPageBanner />

      <Tags tagCards={ tagCards } />
    </>
  )
}
