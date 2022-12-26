import { DependencyInjector, makeInjector } from '../../../injector/DependencyInjector'
import { Provider } from '../../../injector/Provider'
import { PostRepositoryInterface } from '../Domain/PostRepositoryInterface'
import { MysqlPostRepository } from './MysqlPostRepository'
import { GetPostById } from '../Application/GetPostById'
import { GetPosts } from '../Application/GetPosts'
import { CreatePostComment } from '../Application/CreatePostComment'
import { UserRepositoryInterface } from '../../Auth/Domain/UserRepositoryInterface'
import { MysqlUserRepository } from '../../Auth/Infrastructure/MysqlUserRepository'
import { DateServiceInterface } from '../../../helpers/Domain/DateServiceInterface'
import { DateService } from '../../../helpers/Infrastructure/DateService'
import { UuidGenerator } from '../../../helpers/Domain/UuidGenerator'
import { DeletePostComment } from '../Application/DeletePostComment'
import { UpdatePostComment } from '../Application/UpdatePostComment'

const postRepository: Provider<PostRepositoryInterface> =
  { provide: 'PostRepositoryInterface',
    useClass: () => {
      return new MysqlPostRepository()
    }
  }

const getPostById: Provider<GetPostById> =
  { provide: 'GetPostById',
    useClass: () => {
      return new GetPostById(
        bindings.get('PostRepositoryInterface')
      )
    }
  }

const getPosts: Provider<GetPosts> =
  { provide: 'GetPosts',
    useClass: () => {
      return new GetPosts(
        bindings.get('PostRepositoryInterface')
      )
    }
  }

const userRepository: Provider<UserRepositoryInterface> =
  { provide: 'UserRepositoryInterface',
    useClass: () => {
      return new MysqlUserRepository()
    }
  }

const dateService: Provider<DateServiceInterface> =
  { provide: 'DateServiceInterface',
    useClass: () => {
      return new DateService()
    }
  }

const idGenerator: Provider<UuidGenerator> =
  { provide: 'IdGenerator',
    useClass: () => {
      return new UuidGenerator()
    }
  }

const createComment: Provider<CreatePostComment> =
  { provide: 'CreatePostComment',
    useClass: () => {
      return new CreatePostComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface'),
        bindings.get('DateServiceInterface'),
        bindings.get('IdGenerator')

      )
    }
  }

  const deleteComment: Provider<DeletePostComment> =
  { provide: 'DeletePostComment',
    useClass: () => {
      return new DeletePostComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface'),
      )
    }
  }

  const updateComment: Provider<UpdatePostComment> =
  { provide: 'UpdatePostComment',
    useClass: () => {
      return new UpdatePostComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface'),
      )
    }
  }

const baseUrl: Provider<string> =
  { provide: 'BaseUrl',
    useValue: process.env.BASE_URL
  }
  
export const bindings: DependencyInjector = makeInjector([
  postRepository,
  getPostById,
  getPosts,
  userRepository,
  dateService,
  idGenerator,
  createComment,
  updateComment,
  deleteComment,
  baseUrl
])