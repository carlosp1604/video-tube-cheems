import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { VideoEmbedPage, VideoEmbedPageProps } from '~/components/pages/VideoEmbedPage/VideoEmbedPage'
import { Settings } from 'luxon'

export const getServerSideProps: GetServerSideProps<VideoEmbedPageProps> = async (context) => {
  if (!context.query.slug) {
    return {
      notFound: true,
    }
  }

  const slug = String(context.query.slug)
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  // TODO: Consider to create a new use-case to retrieve only video data
  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')
  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  try {
    const postWithCount = await useCase.get({ slug })

    return {
      props: {
        post: PostComponentDtoTranslator.fromApplicationDto(postWithCount.post, locale),
        htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
      },
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default VideoEmbedPage
