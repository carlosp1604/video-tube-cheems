import { MysqlProducerRepository } from './MysqlProducerRepository'
import { Provider } from '~/injector/Provider'
import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { DependencyInjector, makeInjector } from '~/injector/DependencyInjector'

const producerRepository: Provider<ProducerRepositoryInterface> =
  {
    provide: 'ProducerRepositoryInterface',
    useClass: () => {
      return new MysqlProducerRepository()
    },
  }

const getAllProducers: Provider<GetAllProducers> =
  {
    provide: 'GetAllProducers',
    useClass: () => {
      return new GetAllProducers(
        bindings.get('ProducerRepositoryInterface')
      )
    },
  }

export const bindings: DependencyInjector = makeInjector([
  producerRepository,
  getAllProducers,
])
