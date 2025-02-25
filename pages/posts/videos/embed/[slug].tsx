import { container } from '~/awilix.container'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetServerSideProps } from 'next'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import { EmbedPage, EmbedPageProps } from '~/components/pages/EmbedPage/EmbedPage'

export const getServerSideProps: GetServerSideProps<EmbedPageProps> = async (context) => {
  if (!context.query.slug) {
    return {
      notFound: true,
    }
  }

  const slug = String(context.query.slug)
  const locale = context.locale ?? 'en'

  const useCase = container.resolve<GetPostBySlug>('getPostBySlugUseCase')

  try {
    const postWithCount = await useCase.get({ slug })

    if (postWithCount.externalLink) {
      return {
        notFound: true,
      }
    }

    if (postWithCount.post.deletedAt) {
      return {
        notFound: true,
      }
    }

    const postComponentDto = PostComponentDtoTranslator.fromApplicationDto(postWithCount.post, locale)

    // Experimental: Try to improve performance
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=60'
    )

    return {
      props: {
        post: postComponentDto,
      },
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default EmbedPage
