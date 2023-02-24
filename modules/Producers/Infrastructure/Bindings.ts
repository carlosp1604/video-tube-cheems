import { DependencyInjector, makeInjector } from '../../../injector/DependencyInjector'
import { Provider } from '../../../injector/Provider'
import { GetAllProducers } from '../Application/GetAllProducers'
import { ProducerRepositoryInterface } from '../Domain/ProducerRepositoryInterface'
import { MysqlProducerRepository } from './MysqlProducerRepository'

const producerRepository: Provider<ProducerRepositoryInterface> =
  { provide: 'ProducerRepositoryInterface',
    useClass: () => {
      return new MysqlProducerRepository()
    }
  }

const getAllProducers: Provider<GetAllProducers> =
  { provide: 'GetAllProducers',
    useClass: () => {
      return new GetAllProducers(
        bindings.get('ProducerRepositoryInterface')
      )
    }
  }
  
export const bindings: DependencyInjector = makeInjector([
  producerRepository,
  getAllProducers
])