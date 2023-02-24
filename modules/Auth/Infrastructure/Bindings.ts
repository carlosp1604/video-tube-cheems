import { DependencyInjector, makeInjector } from '../../../injector/DependencyInjector'
import { MysqlUserRepository } from './MysqlUserRepository'
import { Provider } from '../../../injector/Provider'
import { UserRepositoryInterface } from '../Domain/UserRepositoryInterface'
import { BcryptCryptoService } from '../../../helpers/Infrastructure/BcryptCryptoService'
import { CryptoServiceInterface } from '../../../helpers/Domain/CryptoServiceInterface'
import { GetUserById } from '../Application/GetUserById'

const userRepository: Provider<UserRepositoryInterface> =
  { provide: 'UserRepositoryInterface',
    useClass: () => {
      return new MysqlUserRepository()
    }
  }
  
const cryptoService: Provider<CryptoServiceInterface> =
  { provide: 'CryptoServiceInterface',
    useClass: () => {
      return new BcryptCryptoService()
    }
  }

const getUserById: Provider<GetUserById> =
  { provide: 'GetUserById',
    useClass: () => {
      return new GetUserById(
        bindings.get('UserRepositoryInterface')
      )
    }
  }

export const bindings: DependencyInjector = makeInjector([
  userRepository,
  cryptoService,
  getUserById
])