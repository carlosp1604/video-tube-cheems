import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import { AddPostView } from '~/modules/Posts/Application/AddPostView/AddPostView'
import { GetPostBySlug } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlug'
import { GetUserById } from '~/modules/Auth/Application/GetUser/GetUserById'
import { ValidateToken } from '~/modules/Auth/Application/ValidateToken/ValidateToken'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { GetPopularProducers } from '~/modules/Producers/Application/GetPopularProducers'
import { MailerSendUserEmailSender } from '~/modules/Auth/Infrastructure/MailerSendUserEmailSender'
import { VerifyEmailAddress } from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddress'
import { CreatePostReaction } from '~/modules/Posts/Application/CreatePostReaction/CreatePostReaction'
import { MysqlUserRepository } from '~/modules/Auth/Infrastructure/MysqlUserRepository'
import { MysqlPostRepository } from '~/modules/Posts/Infrastructure/MysqlPostRepository'
import { BcryptCryptoService } from '~/helpers/Infrastructure/BcryptCryptoService'
import { MysqlActorRepository } from '~/modules/Actors/Infrastructure/MysqlActorRepository'
import { MysqlProducerRepository } from '~/modules/Producers/Infrastructure/MysqlProducerRepository'
import { MysqlVerificationTokenRepository } from '~/modules/Auth/Infrastructure/MysqlVerificationTokenRepository'
import { asClass, asFunction, createContainer, InjectionMode } from 'awilix'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { GetPostUserInteraction } from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteraction'
import { DateService } from '~/helpers/Infrastructure/DateService'
import { GetPostPostComments } from '~/modules/Posts/Application/GetPostPostComments/GetPostPostComments'
import { MysqlPostCommentRepository } from '~/modules/Posts/Infrastructure/MysqlPostCommentRepository'
import { GetPostPostChildComments } from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildComments'
import { CreatePostComment } from '~/modules/Posts/Application/CreatePostComment/CreatePostComment'
import { CreatePostChildComment } from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildComment'
import { MailerSend } from 'mailersend'
import { DeletePostComment } from '~/modules/Posts/Application/DeletePostComment/DeletePostComment'
import { DeletePostReaction } from '~/modules/Posts/Application/DeletePostReaction/DeletePostReaction'
import { MysqlReactionRepository } from '~/modules/Reactions/Infrastructure/MysqlReactionRepository'
import {
  CreatePostCommentReaction
} from '~/modules/Posts/Application/CreatePostCommentReaction/CreatePostCommentReaction'
import {
  DeletePostCommentReaction
} from '~/modules/Posts/Application/DeletePostCommentReaction/DeletePostCommentReaction'
import { AddSavedPost } from '~/modules/Auth/Application/AddSavedPost/AddSavedPost'
import { DeleteSavedPost } from '~/modules/Auth/Application/DeleteSavedPost/DeleteSavedPost'
import { GetUserSavedPosts } from '~/modules/Posts/Application/GetUserSavedPosts/GetUserSavedPosts'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetUserHistory } from '~/modules/Posts/Application/GetUserHistory/GetUserHistory'
import { GetActorBySlug } from '~/modules/Actors/Application/GetActorBySlug/GetActorBySlug'
import { GetProducerBySlug } from '~/modules/Producers/Application/GetProducerBySlug/GetProducerBySlug'
import { MysqlPostTagRepository } from '~/modules/PostTag/Infrastructure/MysqlPostTagRepository'
import { GetTagBySlug } from '~/modules/PostTag/Application/GetTagBySlug/GetTagBySlug'
import { GetProducers } from '~/modules/Producers/Application/GetProducers/GetProducers'
import { AddActorView } from '~/modules/Actors/Application/AddActorView/AddActorView'
import { AddProducerView } from '~/modules/Producers/Application/AddProducerView/AddProducerView'
import { OauthLoginSignUp } from '~/modules/Auth/Application/OauthLoginSignUp/OauthLoginSignUp'

/**
 * We create a container to register our classes dependencies
 * This will be a global container, so it can be used in any module
 * CLASSIC MODE: https://github.com/jeffijoe/awilix#injection-modes
 */
const container = createContainer({ injectionMode: InjectionMode.CLASSIC })

/**
 * Register dependencies in the container
 */
container.register('cryptoService', asClass(BcryptCryptoService))
container.register('userRepository', asClass(MysqlUserRepository))
container.register('verificationTokenRepository', asClass(MysqlVerificationTokenRepository))
container.register('emailFromAddress', asFunction(() => {
  const { env } = process

  const fromAddress = env.EMAIL_FROM_ADDRESS

  if (!fromAddress) {
    throw Error('Missing EMAIL_FROM_ADDRESS environment variable to build SendTemplatedEmailCommand.')
  }

  return fromAddress
}))
container.register('emailBrandName', asFunction(() => {
  const { env } = process

  const emailBrandName = env.EMAIL_BRAND_NAME

  if (!emailBrandName) {
    throw Error('Missing EMAIL_BRAND_NAME environment variable to build SendTemplatedEmailCommand.')
  }

  return emailBrandName
}))
container.register('userEmailSender', asClass(MailerSendUserEmailSender))
// FIXME: This was the only way to make it works...
container.register('postRepository', asFunction(() => {
  return new MysqlPostRepository()
}))
container.register('actorRepository', asClass(MysqlActorRepository))
container.register('producerRepository', asClass(MysqlProducerRepository))
container.register('dateService', asClass(DateService))
container.register('postCommentRepository', asClass(MysqlPostCommentRepository))
container.register('mailerSend', asFunction(() => {
  const apiKey = process.env.EMAIL_API_TOKEN

  if (!apiKey) {
    throw Error('Missing EMAIL_API_TOKEN environment variable to build MailerSend')
  }

  return new MailerSend({
    apiKey,
  })
}))
container.register('baseUrl', asFunction(() => {
  const baseUrl = process.env.BASE_URL

  if (!baseUrl) {
    throw Error('Missing BASE_URL environment variable')
  }

  return baseUrl
}))
container.register('reactionRepository', asClass(MysqlReactionRepository))
container.register('tagRepository', asClass(MysqlPostTagRepository))
/**
 * Use-cases
 */
container.register('oauthLoginSignUpUseCase', asClass(OauthLoginSignUp))
// FIXME: This was the only way to make it works...
container.register('verifyEmailAddressUseCase', asFunction(() => {
  return new VerifyEmailAddress(
    container.resolve('userRepository'),
    container.resolve('verificationTokenRepository'),
    container.resolve('cryptoService'),
    container.resolve('userEmailSender')
  )
}))
container.register('validateTokenUseCase', asClass(ValidateToken))
container.register('getUserByUsername', asClass(GetUserByUsername))
container.register('getUserById', asClass(GetUserById))
container.register('getPostsUseCase', asClass(GetPosts))
container.register('getUserSavedPostsUseCase', asClass(GetUserSavedPosts))
container.register('getUserHistoryUseCase', asClass(GetUserHistory))
container.register('getActorsUseCase', asClass(GetActors))
container.register('getPopularProducersUseCase', asClass(GetPopularProducers))
container.register('getRelatedPostsUseCase', asClass(GetRelatedPosts))
container.register('getPostBySlugUseCase', asClass(GetPostBySlug))
container.register('addPostViewUseCase', asClass(AddPostView))
container.register('addActorViewUseCase', asClass(AddActorView))
container.register('addProducerViewUseCase', asClass(AddProducerView))
container.register('createPostReactionUseCase', asClass(CreatePostReaction))
container.register('getPostUserInteractionUseCase', asClass(GetPostUserInteraction))
container.register('getPostPostCommentsUseCase', asClass(GetPostPostComments))
container.register('getPostPostChildCommentsUseCase', asClass(GetPostPostChildComments))
container.register('createPostCommentUseCase', asClass(CreatePostComment))
container.register('createPostChildCommentUseCase', asClass(CreatePostChildComment))
container.register('deletePostCommentUseCase', asClass(DeletePostComment))
container.register('deletePostReactionUseCase', asClass(DeletePostReaction))
container.register('createPostCommentReactionUseCase', asClass(CreatePostCommentReaction))
container.register('deletePostCommentReactionUseCase', asClass(DeletePostCommentReaction))
container.register('addSavedPostUseCase', asClass(AddSavedPost))
container.register('deleteSavedPostUseCase', asClass(DeleteSavedPost))
container.register('getActorBySlugUseCase', asClass(GetActorBySlug))
container.register('getProducerBySlugUseCase', asClass(GetProducerBySlug))
container.register('getTagBySlugUseCase', asClass(GetTagBySlug))
container.register('getProducersUseCase', asClass(GetProducers))

export { container }
