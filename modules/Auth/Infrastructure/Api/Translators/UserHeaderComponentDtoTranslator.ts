import { DateTime } from 'luxon'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'

export class UserHeaderComponentDtoTranslator {
  public static fromApplication (applicationDto: UserApplicationDto, locale: string): UserProfileHeaderComponentDto {
    const createdAt = DateTime.fromISO(applicationDto.createdAt).setLocale(locale)
      .toLocaleString({ month: 'long', year: 'numeric' })

    return {
      name: applicationDto.name,
      id: applicationDto.id,
      email: applicationDto.email,
      imageUrl: applicationDto.imageUrl,
      createdAt,
      username: applicationDto.username,
    }
  }
}
