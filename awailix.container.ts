import { Login } from '~/modules/Auth/Application/Login/Login'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetActors } from '~/modules/Actors/Application/GetActors'
import { SESClient } from '@aws-sdk/client-ses'
import { CreateUser } from '~/modules/Auth/Application/CreateUser/CreateUser'
import { AddPostView } from '~/modules/Posts/Application/AddPostView/AddPostView'
import { GetPostById } from '~/modules/Posts/Application/GetPostById/GetPostById'
import { GetUserById } from '~/modules/Auth/Application/GetUser/GetUserById'
import { ValidateToken } from '~/modules/Auth/Application/ValidateToken/ValidateToken'
import { GetRelatedPosts } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPosts'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { AWSUserEmailSender } from '~/modules/Auth/Infrastructure/AWSUserEmailSender'
import { ChangeUserPassword } from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPassword'
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

  const awsAccessKey = env.AWS_ACCESS_KEY_ID
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
container.register('loginUseCase', asClass(Login))
// FIXME: This was the only way to make it works...
container.register('createUserUseCase', asFunction(() => {
  return new CreateUser(
    container.resolve('userRepository'),
    container.resolve('verificationTokenRepository'),
    container.resolve('cryptoService')
  )
}))
container.register('verifyEmailAddressUseCase', asFunction(() => {
  return new VerifyEmailAddress(
    container.resolve('userRepository'),
    container.resolve('verificationTokenRepository'),
    container.resolve('cryptoService'),
    container.resolve('userEmailSender')
  )
}))
container.register('validateTokenUseCase', asClass(ValidateToken))
container.register('changeUserPasswordUseCase', asClass(ChangeUserPassword))
container.register('getUserByUsername', asClass(GetUserByUsername))
container.register('getUserById', asClass(GetUserById))
container.register('getPosts', asClass(GetPosts))
container.register('getActors', asClass(GetActors))
container.register('getAllProducers', asClass(GetAllProducers))
container.register('getRelatedPosts', asClass(GetRelatedPosts))
container.register('getPostById', asClass(GetPostById))
container.register('addPostView', asClass(AddPostView))
container.register('addPostReaction', asClass(CreatePostReaction))

export { container }
