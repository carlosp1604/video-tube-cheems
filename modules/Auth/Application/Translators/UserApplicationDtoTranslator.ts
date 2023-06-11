import { User } from '~/modules/Auth/Domain/User'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'

export class UserApplicationDtoTranslator {
  public static fromDomain (user: User): UserApplicationDto {
    let emailVerified: string | null = null

    if (user.emailVerified !== null) {
      emailVerified = user.emailVerified.toISO()
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      imageUrl: user.imageUrl,
      emailVerified,
      updatedAt: user.updatedAt.toISO(),
      email: user.email,
      language: user.language,
      createdAt: user.createdAt.toISO(),
    }
  }
}
