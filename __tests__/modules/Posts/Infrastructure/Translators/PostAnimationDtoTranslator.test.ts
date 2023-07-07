import { DateTime } from 'luxon'
import { PostAnimationDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostAnimationDtoTranslator'
import { MetaApplicationDto } from '~/modules/Posts/Application/Dtos/MetaApplicationDto'

describe('~/modules/Posts/Infrastructure/Translators/PostAnimationDtoTranslator.ts', () => {
  let postMeta: MetaApplicationDto[]

  beforeEach(() => {
    postMeta = [
      {
        postId: 'expected-post-id',
        type: 'trailer',
        value: 'https://expected-trailer-url.mp4',
        createdAt: DateTime.now().toISO(),
      },
    ]
  })

  it('should return the correct data', () => {
    const animationDto = PostAnimationDtoTranslator.fromApplication(postMeta)

    expect(animationDto).toStrictEqual({
      type: 'mp4',
      value: 'https://expected-trailer-url.mp4',
    })
  })

  it('should return null if post meta trailer type is not found', () => {
    postMeta = []

    const animationDto = PostAnimationDtoTranslator.fromApplication(postMeta)

    expect(animationDto).toStrictEqual(null)
  })
})
