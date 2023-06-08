import { Settings } from 'luxon'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'
import {
  UserHeaderComponentDtoTranslator
} from '~/modules/Auth/Infrastructure/Translators/UserHeaderComponentDtoTranslator'

describe('~/modules/Auth/Infrastructure/Translators/UserHeaderComponentDtoTranslator.ts', () => {
  let applicationDto: UserApplicationDto
  const date = '2022-10-21T19:41:00'

  beforeEach(() => {
    applicationDto = {
      createdAt: date,
      email: 'expected-email@test.es',
      emailVerified: date,
      id: 'expected-user-id',
      imageUrl: 'https://expected-image',
      username: 'expected_username',
      name: 'expected-name',
      language: 'expected-language',
      updatedAt: date,
    }

    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'
  })

  it('should translate application dto correctly', () => {
    const translation = UserHeaderComponentDtoTranslator.fromApplication(applicationDto)

    expect(translation).toStrictEqual({
      createdAt: 'octubre de 2022',
      email: 'expected-email@test.es',
      id: 'expected-user-id',
      imageUrl: 'https://expected-image',
      name: 'expected-name',
      username: 'expected_username',
    })
  })

  it('should return the correct dto when user has nullish properties', async () => {
    applicationDto = {
      ...applicationDto,
      imageUrl: null,
      emailVerified: null,
    }
    const response = await UserHeaderComponentDtoTranslator.fromApplication(applicationDto)

    expect(response).toEqual({
      createdAt: 'octubre de 2022',
      email: 'expected-email@test.es',
      id: 'expected-user-id',
      imageUrl: null,
      name: 'expected-name',
      username: 'expected_username',
    })
  })
})
