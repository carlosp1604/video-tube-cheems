import { DependencyInjector, makeInjector } from '../../../injector/DependencyInjector'
import { Provider } from '../../../injector/Provider'
import { PostRepositoryInterface } from '../Domain/PostRepositoryInterface'
import { MysqlPostRepository } from './MysqlPostRepository'
import { GetPostById } from '../Application/GetPostById'
import { GetPosts } from '../Application/GetPosts'
import { CreatePostComment } from '../Application/CreatePostComment'
import { UserRepositoryInterface } from '../../Auth/Domain/UserRepositoryInterface'
import { MysqlUserRepository } from '../../Auth/Infrastructure/MysqlUserRepository'
import { DeletePostComment } from '../Application/DeletePostComment'
import { UpdatePostComment } from '../Application/UpdatePostComment'
import { GetPostPostComments } from '../Application/GetPostPostComments'
import { PostCommentRepositoryInterface } from '../Domain/PostCommentRepositoryInterface'
import { MysqlPostCommentRepository } from './MysqlPostCommentRepository'
import { CreatePostChildComment } from '../Application/CreatePostChildComment'
import { GetPostPostChildComments } from '../Application/GetPostPostChildComments'
import { GetRelatedPosts } from '../Application/GetRelatedPosts'

const postRepository: Provider<PostRepositoryInterface> =
  { provide: 'PostRepositoryInterface',
    useClass: () => {
      return new MysqlPostRepository()
    }
  }

const postCommentRepository: Provider<PostCommentRepositoryInterface> =
  { provide: 'PostCommentRepositoryInterface',
    useClass: () => {
      return new MysqlPostCommentRepository()
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

const getRelatedPosts: Provider<GetRelatedPosts> =
  { provide: 'GetRelatedPosts',
    useClass: () => {
      return new GetRelatedPosts(
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

const createComment: Provider<CreatePostComment> =
  { provide: 'CreatePostComment',
    useClass: () => {
      return new CreatePostComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface')
      )
    }
  }

const createChildComment: Provider<CreatePostChildComment> =
  { provide: 'CreatePostChildComment',
    useClass: () => {
      return new CreatePostChildComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface')
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

const getPostPostComments: Provider<GetPostPostComments> =
  { provide: 'GetPostPostComments',
    useClass: () => {
      return new GetPostPostComments(
        bindings.get('PostCommentRepositoryInterface'),
      )
    }
  }

const getPostPostChildComments: Provider<GetPostPostChildComments> =
  { provide: 'GetPostPostChildComments',
    useClass: () => {
      return new GetPostPostChildComments(
        bindings.get('PostCommentRepositoryInterface'),
      )
    }
  }

const baseUrl: Provider<string> =
  { provide: 'BaseUrl',
    useValue: process.env.BASE_URL
  }
  
export const bindings: DependencyInjector = makeInjector([
  postRepository,
  postCommentRepository,
  getPostPostComments,
  getPostPostChildComments,
  getPostById,
  getPosts,
  getRelatedPosts,
  userRepository,
  createChildComment,
  createComment,
  updateComment,
  deleteComment,
  baseUrl
])