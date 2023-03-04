import { GetStaticProps, NextPage } from 'next'
import styles from '../Components/pages/HomePage/HomePage.module.scss'
import { bindings as PostBindings } from '../modules/Posts/Infrastructure/Bindings'
import { GetPosts } from '../modules/Posts/Application/GetPosts'
import { GetAllProducers } from '../modules/Producers/Application/GetAllProducers'
import { bindings as ProducerBindings } from '../modules/Producers/Infrastructure/Bindings'
import { ProducerComponentDto } from '../modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { ProducerListComponentDtoTranslator } from '../modules/Producers/Infrastructure/Translators/ProducerListComponentDtoTranslator'
import { ProducerList } from '../modules/Producers/Infrastructure/Components/ProducerList'
import { PostCardComponentDto } from '../modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCardComponentDtoTranslator } from '../modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { useEffect, useState } from 'react'
import { PaginatedPostCardGallery } from '../Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { FetchPostsFilter } from '../modules/Shared/Infrastructure/InfrastructureFilter'

const defaultProducer: ProducerComponentDto = {
  id: '',
  name: 'Latest videos',
  brandHexColor: '#44403C'
} 

interface Props {
  posts: PostCardComponentDto[]
  producers: ProducerComponentDto[]
  postsNumber: number
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const getPosts = PostBindings.get<GetPosts>('GetPosts')
  const getProducers = ProducerBindings.get<GetAllProducers>('GetAllProducers')

  const locale = context.locale ?? 'en'

  const props: Props = {
    posts: [],
    producers: [],
    postsNumber: 0,
  }

  try {
    const posts = await getPosts.get({
      page: 1,
      filters: [],
      sortCriteria: 'desc',
      sortOption: 'date',
      postsPerPage: 20,
    })

    const producers = await getProducers.get()
    const producerComponents = producers.map((producer) => {
      return ProducerListComponentDtoTranslator.fromApplication(producer)
    })

    producerComponents.unshift(defaultProducer)
    
    props.posts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postReactions, locale)
    })
    props.postsNumber = posts.postsNumber
    props.producers = producerComponents
  }
  catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props
  }
}

const HomePage: NextPage<Props> = ({ postsNumber, posts, producers }) => {
  const [activeProducer, setActiveProducer] = useState<ProducerComponentDto>(defaultProducer)
  const [totalPosts, setTotalPosts] = useState<number>(postsNumber)
  const [producerFilter, setProducerFilter] = useState<FetchPostsFilter>({
    type: 'producerId',
    value: null,
  })

  useEffect(() => {
    setProducerFilter({
      ...producerFilter,
      value: activeProducer.id === '' ? null: activeProducer.id
    })
  }, [activeProducer])

  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={producers}
        setActiveProducer={ setActiveProducer }
        activeProducer={ activeProducer }
      />

      <h1 className={ styles.home__title }>
        { activeProducer.name }
        <span className={ styles.home__videosQuantity }>
          {`${totalPosts} Videos`}
        </span>
      </h1>

      <PaginatedPostCardGallery 
        posts={ posts }
        postsNumber={ totalPosts }
        setPostsNumber={ setTotalPosts}
        fetchEndpoint={'/api/posts'}
        filters={[producerFilter]}
      />
    </div>
  )
}

export default HomePage


