import { DependencyInjector, makeInjector } from '../../../injector/DependencyInjector'
import { Provider } from '../../../injector/Provider'
import { ActorRepositoryInterface } from '../Domain/ActorRepositoryInterface'
import { MysqlActorRepository } from './MysqlActorRepository'
import { GetActor } from '../Application/GetActor'
import { GetActors } from '../Application/GetActors'

const actorRepository: Provider<ActorRepositoryInterface> =
  { provide: 'ActorRepositoryInterface',
    useClass: () => {
      return new MysqlActorRepository()
    }
  }

const getActor: Provider<GetActor> = 
  { provide: 'GetActor',
    useClass: () => {
      return new GetActor(
        bindings.get<ActorRepositoryInterface>('ActorRepositoryInterface')
      )
    }
  }

const getActors: Provider<GetActors> = 
  { provide: 'GetActors',
    useClass: () => {
      return new GetActors(
        bindings.get<ActorRepositoryInterface>('ActorRepositoryInterface')
      )
    }
  }

export const bindings: DependencyInjector = makeInjector([
  actorRepository,
  getActors,
  getActor
])