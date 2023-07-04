import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { DateTime } from 'luxon'
import { VideoComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/VideoComponentDtoTranslator'

describe('~/modules/Posts/Infrastructure/Dtos/VideoComponentDto.ts', () => {
  let postApplicationDto: PostApplicationDto
  const nowDate = DateTime.now()

  beforeEach(() => {
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
      actors: [],
      tags: [],
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
  })

  it('should translate data correctly', () => {
    const translatedData = VideoComponentDtoTranslator.fromApplicationDto(postApplicationDto)

    expect(translatedData).toStrictEqual({
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
  })

  it('should translate data correctly if post meta thumb type is not found', () => {
    postApplicationDto = {
      ...postApplicationDto,
      meta: [
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

    const translatedData = VideoComponentDtoTranslator.fromApplicationDto(postApplicationDto)

    expect(translatedData).toStrictEqual({
      download: 'expected-download-url',
      poster: '',
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
  })

  it('should translate data correctly if post meta download_url type is not found', () => {
    postApplicationDto = {
      ...postApplicationDto,
      meta: [
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'thumb',
          value: 'expected-post-thumb',
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

    const translatedData = VideoComponentDtoTranslator.fromApplicationDto(postApplicationDto)

    expect(translatedData).toStrictEqual({
      download: '',
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
  })

  it('should ignore unsupported video quality', () => {
    postApplicationDto = {
      ...postApplicationDto,
      meta: [
        ...postApplicationDto.meta,
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: '750p',
          value: 'some-value',
        },
      ],
    }

    const translatedData = VideoComponentDtoTranslator.fromApplicationDto(postApplicationDto)

    expect(translatedData).toStrictEqual({
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
  })
})
