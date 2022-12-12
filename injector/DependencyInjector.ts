import { Provider } from './Provider'

export const makeInjector = (providers: Provider<any>[]): DependencyInjector => {
  return new DependencyInjector(providers)
}

export class DependencyInjector {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private providers: Provider<any>[]
  ) {}

  public get<T>(token: string): T {
    let requestedProvider: Provider<T> | null = null

    for (const provider of this.providers) {
      if (provider.provide === token) {
        requestedProvider = provider
        break
      }
    }

    if (requestedProvider === null) {
      throw Error(`Provider not found for token ${token}`)
    }

    if (requestedProvider.useValue) {
      return requestedProvider.useValue
    }

    if (requestedProvider.useClass) {
      return requestedProvider.useClass()
    }

    if (requestedProvider.useFactory) {
      return requestedProvider.useFactory()
    }

    throw Error(`Provider not found for token ${token}`)
  }
}