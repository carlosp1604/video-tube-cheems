import { DateTime } from 'luxon'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  PostWithProducerAndMetaApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithProducerAndMetaApplicationDto'
import { PostAnimationDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostAnimationDtoTranslator'
import { DateService } from '~/helpers/Infrastructure/DateService'

describe('~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator.ts', () => {
  const nowDate = DateTime.now().minus({ hour: 1 })
  let postWithProducerAndMetaDto: PostWithProducerAndMetaApplicationDto

  beforeEach(() => {
    postWithProducerAndMetaDto = {
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
          type: 'duration',
          value: '3600',
        },
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'trailer',
          value: 'expected-animation-url.mp4',
        },
      ],
      translations: [
        {
          translations: [
            {
              createdAt: nowDate.toISO(),
              language: 'es',
              value: 'Some expected spanish title',
              translatableId: 'expected-post-id',
              field: 'title',
            },
          ],
          language: 'es',
        },
      ],
    }

    jest.spyOn(DateService.prototype, 'formatAgoLike').mockReturnValueOnce('Hoy')
    jest.spyOn(DateService.prototype, 'formatSecondsToHHMMSSFormat').mockReturnValueOnce('01:00:00')
  })

  it('should translate data correctly', () => {
    jest.spyOn(PostAnimationDtoTranslator, 'fromApplication').mockReturnValueOnce({
      type: 'mp4',
      value: 'expected-animation-url.mp4',
    })

    const translatedData = PostCardComponentDtoTranslator.fromApplication(postWithProducerAndMetaDto, 1, 'en')

    expect(translatedData).toStrictEqual({
      animation: {
        type: 'mp4',
        value: 'expected-animation-url.mp4',
      },
      date: 'Hoy',
      duration: '01:00:00',
      id: 'expected-post-id',
      producer: {
        id: 'expected-producer-id',
        imageUrl: 'expected-producer-image-url',
        name: 'expected-producer-name',
      },
      slug: 'expected-post-slug',
      thumb: 'expected-post-thumb',
      title: 'expected-post-title',
      views: 1,
    })
  })

  it('should translate data correctly when post meta thumb type is not found', () => {
    jest.spyOn(PostAnimationDtoTranslator, 'fromApplication').mockReturnValueOnce({
      type: 'mp4',
      value: 'expected-animation-url.mp4',
    })

    postWithProducerAndMetaDto = {
      ...postWithProducerAndMetaDto,
      meta: [
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'duration',
          value: '3600',
        },
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'trailer',
          value: 'expected-animation-url.mp4',
        },
      ],
    }

    const translatedData = PostCardComponentDtoTranslator.fromApplication(postWithProducerAndMetaDto, 1, 'en')

    expect(translatedData).toStrictEqual({
      animation: {
        type: 'mp4',
        value: 'expected-animation-url.mp4',
      },
      date: 'Hoy',
      duration: '01:00:00',
      id: 'expected-post-id',
      producer: {
        id: 'expected-producer-id',
        imageUrl: 'expected-producer-image-url',
        name: 'expected-producer-name',
      },
      slug: 'expected-post-slug',
      thumb: '',
      title: 'expected-post-title',
      views: 1,
    })
  })

  it('should translate data correctly when post meta duration type is not found', () => {
    jest.spyOn(PostAnimationDtoTranslator, 'fromApplication').mockReturnValueOnce({
      type: 'mp4',
      value: 'expected-animation-url.mp4',
    })

    postWithProducerAndMetaDto = {
      ...postWithProducerAndMetaDto,
      meta: [
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'thumb',
          value: 'expected-thumb-url',
        },
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'trailer',
          value: 'expected-animation-url.mp4',
        },
      ],
    }

    const translatedData = PostCardComponentDtoTranslator.fromApplication(postWithProducerAndMetaDto, 1, 'en')

    expect(translatedData).toStrictEqual({
      animation: {
        type: 'mp4',
        value: 'expected-animation-url.mp4',
      },
      date: 'Hoy',
      duration: '',
      id: 'expected-post-id',
      producer: {
        id: 'expected-producer-id',
        imageUrl: 'expected-producer-image-url',
        name: 'expected-producer-name',
      },
      slug: 'expected-post-slug',
      thumb: 'expected-thumb-url',
      title: 'expected-post-title',
      views: 1,
    })
  })

  it('should should handle nullish properties correctly', () => {
    postWithProducerAndMetaDto = {
      ...postWithProducerAndMetaDto,
      producer: null,
      meta: [
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'thumb',
          value: 'expected-thumb-url',
        },
        {
          createdAt: nowDate.toISO(),
          postId: 'expected-post-id',
          type: 'duration',
          value: '3600',
        },
      ],
    }

    jest.spyOn(PostAnimationDtoTranslator, 'fromApplication').mockReturnValueOnce(null)

    const translatedData = PostCardComponentDtoTranslator.fromApplication(postWithProducerAndMetaDto, 1, 'en')

    expect(translatedData).toStrictEqual({
      animation: null,
      date: 'Hoy',
      duration: '01:00:00',
      id: 'expected-post-id',
      producer: null,
      slug: 'expected-post-slug',
      thumb: 'expected-thumb-url',
      title: 'expected-post-title',
      views: 1,
    })
  })

  describe('title translation', () => {
    it('should set the correct title if title translation exists', () => {
      const translatedData = PostCardComponentDtoTranslator.fromApplication(postWithProducerAndMetaDto, 1, 'es')

      expect(translatedData.title).toStrictEqual('Some expected spanish title')
    })

    it('should set the default title if title translation does not exist', () => {
      const translatedData = PostCardComponentDtoTranslator.fromApplication(postWithProducerAndMetaDto, 1, 'en')

      expect(translatedData.title).toStrictEqual('expected-post-title')
    })
  })
})
