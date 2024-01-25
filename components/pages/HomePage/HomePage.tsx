import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { useTranslation } from 'next-i18next'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { Home } from '~/components/Home/Home'
import {
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const HomePage: NextPage<Props> = (props: Props) => {
  const { t } = useTranslation(['home_page'])

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(t('home_page_title'), t('home_page_description'))
  ).getProperties()
  const htmlPageMetaProps = { ...props.htmlPageMetaContextProps, ...htmlPageMetaUrlProps }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <Home
        page={ props.page }
        activeProducer={ props.activeProducer }
        producers={ props.producers }
        initialPosts={ props.initialPosts }
        initialPostsNumber={ props.initialPostsNumber }
        order={ props.order }
      />
    </>
  )
}
