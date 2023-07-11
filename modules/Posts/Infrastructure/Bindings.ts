import { Provider } from '~/injector/Provider'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { MysqlPostRepository } from '~/modules/Posts/Infrastructure/MysqlPostRepository'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostCommentRepositoryInterface'
import { MysqlPostCommentRepository } from '~/modules/Posts/Infrastructure/MysqlPostCommentRepository'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { MysqlUserRepository } from '~/modules/Auth/Infrastructure/MysqlUserRepository'
import { CreatePostComment } from '~/modules/Posts/Application/CreatePostComment/CreatePostComment'
import { CreatePostChildComment } from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildComment'
import { DeletePostComment } from '~/modules/Posts/Application/DeletePostComment'
import { UpdatePostComment } from '~/modules/Posts/Application/UpdatePostComment'
import { GetPostPostComments } from '~/modules/Posts/Application/GetPostPostComments/GetPostPostComments'
import { GetPostPostChildComments } from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildComments'
import { DependencyInjector, makeInjector } from '~/injector/DependencyInjector'

const postRepository: Provider<PostRepositoryInterface> =
  {
    provide: 'PostRepositoryInterface',
    useClass: () => {
      return new MysqlPostRepository()
    },
  }

const postCommentRepository: Provider<PostCommentRepositoryInterface> =
  {
    provide: 'PostCommentRepositoryInterface',
    useClass: () => {
      return new MysqlPostCommentRepository()
    },
  }

const getPostById: Provider<GetPostBySlug> =
  {
    provide: 'GetPostById',
    useClass: () => {
      return new GetPostBySlug(
        bindings.get('PostRepositoryInterface')
      )
    },
  }

const getPosts: Provider<GetPosts> =
  {
    provide: 'GetPosts',
    useClass: () => {
      return new GetPosts(
        bindings.get('PostRepositoryInterface')
      )
    },
  }

const getRelatedPosts: Provider<GetRelatedPosts> =
  {
    provide: 'GetRelatedPosts',
    useClass: () => {
      return new GetRelatedPosts(
        bindings.get('PostRepositoryInterface')
      )
    },
  }

const userRepository: Provider<UserRepositoryInterface> =
  {
    provide: 'UserRepositoryInterface',
    useClass: () => {
      return new MysqlUserRepository()
    },
  }

const createComment: Provider<CreatePostComment> =
  {
    provide: 'CreatePostComment',
    useClass: () => {
      return new CreatePostComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface')
      )
    },
  }

const createChildComment: Provider<CreatePostChildComment> =
  {
    provide: 'CreatePostChildComment',
    useClass: () => {
      return new CreatePostChildComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface')
      )
    },
  }

const deleteComment: Provider<DeletePostComment> =
  {
    provide: 'DeletePostComment',
    useClass: () => {
      return new DeletePostComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface')
      )
    },
  }

const updateComment: Provider<UpdatePostComment> =
  {
    provide: 'UpdatePostComment',
    useClass: () => {
      return new UpdatePostComment(
        bindings.get('PostRepositoryInterface'),
        bindings.get('UserRepositoryInterface')
      )
    },
  }

const getPostPostComments: Provider<GetPostPostComments> =
  {
    provide: 'GetPostPostComments',
    useClass: () => {
      return new GetPostPostComments(
        bindings.get('PostCommentRepositoryInterface')
      )
    },
  }

const getPostPostChildComments: Provider<GetPostPostChildComments> =
  {
    provide: 'GetPostPostChildComments',
    useClass: () => {
      return new GetPostPostChildComments(
        bindings.get('PostCommentRepositoryInterface')
      )
    },
  }

const baseUrl: Provider<string> =
  {
    provide: 'BaseUrl',
    useValue: process.env.BASE_URL,
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
  baseUrl,
])
