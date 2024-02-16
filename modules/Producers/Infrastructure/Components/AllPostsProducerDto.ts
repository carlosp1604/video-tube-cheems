import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import TailwindConfig from '~/tailwind.config'

export const allPostsProducerDto: ProducerComponentDto = {
  id: '',
  slug: 'all-posts',
  name: 'all_videos_producer',
  brandHexColor: TailwindConfig.theme.extend.colors.brand.primary.bg,
}
