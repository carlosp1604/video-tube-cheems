import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { DateTime } from 'luxon'
import { VideoComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/VideoComponentDtoTranslator'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import { PostReactionApplicationDto } from '~/modules/Posts/Application/Dtos/PostReactionApplicationDto'
import { Reaction } from '~/modules/Posts/Domain/PostReaction'
import { DateService } from '~/helpers/Infrastructure/DateService'

describe('~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator.ts', () => {
  let postApplicationDto: PostApplicationDto
  let userReaction: PostReactionApplicationDto

  const nowDate = DateTime.now()

  beforeEach(() => {
    userReaction = {
      postId: 'expected-post-id',
      userId: 'expected-user-id',
      reactionType: Reaction.LIKE,
    }

    postApplicationDto = {
      id: 'expected-post-id',
      title: 'expected-post-title',
      description: 'expected-post-description',
      slug: 'expected-post-slug',
      publishedAt: nowDate.toISO(),
      producer: {
        brandHexColor: 'expected-producer-color',
        parentProducer: null,
        parentProducerId: null,
        description: 'expected-producer-description',
        id: 'expected-producer-id',
        imageUrl: 'expected-producer-image-url',
        name: 'expected-producer-name',
        createdAt: nowDate.toISO(),
      },
      createdAt: nowDate.toISO(),
      actors: [
        {
          createdAt: nowDate.toISO(),
          description: null,
          name: 'expected-actor-name',
          id: 'expected-actor-id',
          imageUrl: 'expected-image-url',
        },
      ],
      tags: [
        {
          id: 'expected-tag-id',
          name: 'expected-tag-name',
          imageUrl: 'expected-tag-image-url',
          description: null,
        },
      ],
      meta: [
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'thumb',
          value: 'expected-post-thumb',
        },
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-download_url',
          type: 'download_url',
          value: 'expected-download-url',
        },
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: '240p',
          value: 'expected-240p-url.mp4',
        },
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: '720p',
          value: 'expected-240p-url.mp4',
        },
      ],
    }

    jest.spyOn(VideoComponentDtoTranslator, 'fromApplicationDto').mockReturnValueOnce({
      download: 'expected-download-url',
      poster: 'expected-post-thumb',
      qualities: [
        {
          title: '240p',
          value: 'expected-240p-url.mp4',
        },
        {
          title: '720p',
          value: 'expected-240p-url.mp4',
        },
      ],
    })

    jest.spyOn(DateService.prototype, 'formatDateToDateMedFromIso').mockReturnValueOnce('4 jul 2023')
  })

  it('should translate data correctly', () => {
    const componentDto = PostComponentDtoTranslator.fromApplicationDto(
      postApplicationDto,
      1,
      1,
      1,
      userReaction,
      'es'
    )

    expect(componentDto).toStrictEqual({
      actors: [
        {
          id: 'expected-actor-id',
          imageUrl: 'expected-image-url',
          name: 'expected-actor-name',
        },
      ],
      comments: 1,
      date: '4 jul 2023',
      description: 'expected-post-description',
      id: 'expected-post-id',
      producer: {
        id: 'expected-producer-id',
        imageUrl: 'expected-producer-image-url',
        name: 'expected-producer-name',
      },
      reactions: 1,
      tags: [
        {
          id: 'expected-tag-id',
          name: 'expected-tag-name',
        },
      ],
      title: 'expected-post-title',
      userReaction: {
        postId: 'expected-post-id',
        reactionType: 'like',
        userId: 'expected-user-id',
      },
      video: {
        download: 'expected-download-url',
        poster: 'expected-post-thumb',
        qualities: [
          {
            title: '240p',
            value: 'expected-240p-url.mp4',
          },
          {
            title: '720p',
            value: 'expected-240p-url.mp4',
          },
        ],
      },
      views: 1,
    })
  })

  it('should handle nullish properties correctly', () => {
    postApplicationDto = {
      ...postApplicationDto,
      producer: null,
    }

    const componentDto = PostComponentDtoTranslator.fromApplicationDto(
      postApplicationDto,
      1,
      1,
      1,
      null,
      'es'
    )

    // TODO: check default avatar is set when model does not include an imageUrl

    expect(componentDto).toStrictEqual({
      actors: [
        {
          id: 'expected-actor-id',
          imageUrl: 'expected-image-url',
          name: 'expected-actor-name',
        },
      ],
      comments: 1,
      date: '4 jul 2023',
      description: 'expected-post-description',
      id: 'expected-post-id',
      producer: null,
      reactions: 1,
      tags: [
        {
          id: 'expected-tag-id',
          name: 'expected-tag-name',
        },
      ],
      title: 'expected-post-title',
      userReaction: null,
      video: {
        download: 'expected-download-url',
        poster: 'expected-post-thumb',
        qualities: [
          {
            title: '240p',
            value: 'expected-240p-url.mp4',
          },
          {
            title: '720p',
            value: 'expected-240p-url.mp4',
          },
        ],
      },
      views: 1,
    })
  })
})
