import { asClass, asFunction, createContainer, InjectionMode } from 'awilix'
import { BcryptCryptoService } from '~/helpers/Infrastructure/BcryptCryptoService'
import { MysqlUserRepository } from '~/modules/Auth/Infrastructure/MysqlUserRepository'
import { Login } from '~/modules/Auth/Application/Login'
import { CreateUser } from '~/modules/Auth/Application/CreateUser'
import { VerifyEmailAddress } from '~/modules/Auth/Application/VerifyEmailAddress'
import { ValidateToken } from '~/modules/Auth/Application/ValidateToken'
import { RecoverPassword } from '~/modules/Auth/Application/RecoverPassword'
import { ChangeUserPassword } from '~/modules/Auth/Application/ChangeUserPassword'
import { MysqlVerificationTokenRepository } from '~/modules/Auth/Infrastructure/MysqlVerificationTokenRepository'
import { AWSUserEmailSender } from '~/modules/Auth/Infrastructure/AWSUserEmailSender'
import { SESClient } from '@aws-sdk/client-ses'
import { GetUserById } from '~/modules/Auth/Application/GetUserById'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { MysqlPostRepository } from '~/modules/Posts/Infrastructure/MysqlPostRepository'
import { GetActors } from '~/modules/Actors/Application/GetActors'
import { MysqlActorRepository } from '~/modules/Actors/Infrastructure/MysqlActorRepository'
import { MysqlProducerRepository } from '~/modules/Producers/Infrastructure/MysqlProducerRepository'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { GetPostById } from '~/modules/Posts/Application/GetPostById/GetPostById'
import { AddPostView } from '~/modules/Posts/Application/AddPostView/AddPostView'
import { CreatePostReaction } from '~/modules/Posts/Application/CreatePostReaction/CreatePostReaction'

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
container.register('sesClient', asFunction(() => {
  const { env } = process

  const awsAccessKey = env.AWS_ACCESS_KEY
  const awsSecretAccessKey = env.AWS_SECRET_ACCESS_KEY
  const awsRegion = env.AWS_REGION

  if (!awsAccessKey || !awsSecretAccessKey || !awsRegion) {
    throw Error('Missing AWS-SES environment variables to build SESClient')
  }

  return new SESClient({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  })
}))
container.register('userEmailSender', asClass(AWSUserEmailSender))
// FIXME: This was the only way to make it works...
container.register('postRepository', asFunction(() => {
  return new MysqlPostRepository()
}))
container.register('actorRepository', asClass(MysqlActorRepository))
container.register('producerRepository', asClass(MysqlProducerRepository))

/**
 * Use-cases
 */
container.register('LoginUseCase', asClass(Login))
container.register('createUserUseCase', asClass(CreateUser))
container.register('verifyEmailAddressUseCase', asClass(VerifyEmailAddress))
container.register('validateTokenUseCase', asClass(ValidateToken))
container.register('recoverPasswordUseCase', asClass(RecoverPassword))
container.register('changeUserPasswordUseCase', asClass(ChangeUserPassword))
container.register('getUserById', asClass(GetUserById))
container.register('getPosts', asClass(GetPosts))
container.register('getActors', asClass(GetActors))
container.register('getAllProducers', asClass(GetAllProducers))
container.register('getRelatedPosts', asClass(GetRelatedPosts))
container.register('getPostById', asClass(GetPostById))
container.register('addPostView', asClass(AddPostView))
container.register('addPostReaction', asClass(CreatePostReaction))

export { container }
