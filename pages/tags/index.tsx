import { GetStaticProps } from 'next'
import { container } from '~/awilix.container'
import { Settings } from 'luxon'
import { Props as TagsPageProps, TagsPage } from '~/components/pages/TagsPage/TagsPage'
import { GetAllTags } from '~/modules/PostTag/Application/GetAllTags/GetAllTags'
import {
  TagCardComponentDtoTranslator
} from '~/modules/PostTag/Infrastructure/Translators/TagCardComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'

export const getStaticProps: GetStaticProps<TagsPageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the tags page')
  } else {
    baseUrl = env.BASE_URL
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService({
    ...context,
    locale,
    resolvedUrl: '/tags',
  })

  const props: TagsPageProps = {
    tagCards: [],
    baseUrl,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getTags = container.resolve<GetAllTags>('getAllTagsUseCase')

  try {
    const tags = await getTags.get()

    props.tagCards =
      tags.map((tagApplicationDto) => TagCardComponentDtoTranslator.fromApplicationDto(tagApplicationDto, locale))

    return {
      props,
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default TagsPage
