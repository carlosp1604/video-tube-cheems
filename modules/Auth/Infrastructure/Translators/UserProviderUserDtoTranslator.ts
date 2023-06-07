import { DateTime } from 'luxon'
import { UserApplicationDto } from '../../Application/Dtos/UserApplicationDto'
import { UserProviderUserDto } from '../Dtos/UserProviderUserDto'

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
      email: applicationDto.email,
      createdAt,
      emailVerified: applicationDto.emailVerified,
      image: applicationDto.imageUrl,
    }
  }
}
