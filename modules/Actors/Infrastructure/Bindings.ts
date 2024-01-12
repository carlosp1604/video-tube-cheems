import { MysqlActorRepository } from './MysqlActorRepository'
import { Provider } from '~/injector/Provider'
import { DependencyInjector, makeInjector } from '~/injector/DependencyInjector'
import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { GetActorBySlug } from '~/modules/Actors/Application/GetPostBySlug/GetActorBySlug'
import { GetActors } from '~/modules/Actors/Application/GetActors'

const actorRepository: Provider<ActorRepositoryInterface> =
  {
    provide: 'ActorRepositoryInterface',
    useClass: () => {
      return new MysqlActorRepository()
    },
  }

const getActor: Provider<GetActorBySlug> =
  {
    provide: 'GetActor',
    useClass: () => {
      return new GetActorBySlug(
        bindings.get<ActorRepositoryInterface>('ActorRepositoryInterface')
      )
    },
  }

const getActors: Provider<GetActors> =
  {
    provide: 'GetActors',
    useClass: () => {
      return new GetActors(
        bindings.get<ActorRepositoryInterface>('ActorRepositoryInterface')
      )
    },
  }

export const bindings: DependencyInjector = makeInjector([
  actorRepository,
  getActors,
  getActor,
])
