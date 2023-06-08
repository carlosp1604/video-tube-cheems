import { DateTime } from 'luxon'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'
import { UserProviderUserDto } from '~/modules/Auth/Infrastructure/Dtos/UserProviderUserDto'

export class UserProviderUserDtoTranslator {
  public static fromApplication (applicationDto: UserApplicationDto): UserProviderUserDto {
    let createdAt: string | null = null

    if (applicationDto.createdAt !== null) {
      createdAt = DateTime.fromISO(applicationDto.createdAt)
        .toLocaleString({ month: 'long', year: 'numeric' })
    }

    return {
      id: applicationDto.id,
      name: applicationDto.name,
      username: applicationDto.username,
      email: applicationDto.email,
      createdAt,
      emailVerified: applicationDto.emailVerified,
      image: applicationDto.imageUrl,
    }
  }
}
