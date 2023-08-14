import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { DateTime } from 'luxon'
import { VideoComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/VideoComponentDtoTranslator'
import { PostComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator'
import { DateService } from '~/helpers/Infrastructure/DateService'

describe('~/modules/Posts/Infrastructure/Translators/PostComponentDtoTranslator.ts', () => {
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
      translations: [
        {
          translations: [
            {
              createdAt: nowDate.toISO(),
              language: 'en',
              value: 'Some expected english title',
              translatableId: 'expected-post-id',
              field: 'title',
            },
          ],
          language: 'en',
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
    const componentDto = PostComponentDtoTranslator.fromApplicationDto(postApplicationDto, 'es')

    expect(componentDto).toStrictEqual({
      actors: [
        {
          id: 'expected-actor-id',
          imageUrl: 'expected-image-url',
          name: 'expected-actor-name',
        },
      ],
      date: '4 jul 2023',
      description: 'expected-post-description',
      id: 'expected-post-id',
      producer: {
        id: 'expected-producer-id',
        imageUrl: 'expected-producer-image-url',
        name: 'expected-producer-name',
      },
      tags: [
        {
          id: 'expected-tag-id',
          name: 'expected-tag-name',
        },
      ],
      title: 'expected-post-title',
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
    })
  })

  it('should handle nullish properties correctly', () => {
    postApplicationDto = {
      ...postApplicationDto,
      producer: null,
    }

    const componentDto = PostComponentDtoTranslator.fromApplicationDto(postApplicationDto, 'es')

    expect(componentDto).toStrictEqual({
      actors: [
        {
          id: 'expected-actor-id',
          imageUrl: 'expected-image-url',
          name: 'expected-actor-name',
        },
      ],
      date: '4 jul 2023',
      description: 'expected-post-description',
      id: 'expected-post-id',
      producer: null,
      tags: [
        {
          id: 'expected-tag-id',
          name: 'expected-tag-name',
        },
      ],
      title: 'expected-post-title',
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
    })
  })

  describe('translations', () => {
    describe('translations for title field', () => {
      it('should set the correct translation if title translation exists', () => {
        const componentDto = PostComponentDtoTranslator.fromApplicationDto(postApplicationDto, 'en')

        expect(componentDto.title).toStrictEqual('Some expected english title')
      })

      it('should set the default title if translation does not exist', () => {
        const componentDto = PostComponentDtoTranslator.fromApplicationDto(postApplicationDto, 'es')

        expect(componentDto.title).toStrictEqual('expected-post-title')
      })
    })

    describe('translations for description field', () => {
      beforeEach(() => {
        postApplicationDto = {
          ...postApplicationDto,
          translations: [
            {
              translations: [
                {
                  createdAt: nowDate.toISO(),
                  language: 'en',
                  value: 'Some expected english description',
                  translatableId: 'expected-post-id',
                  field: 'description',
                },
              ],
              language: 'en',
            },
          ],
        }
      })
      it('should set the correct translation if description translation exists', () => {
        const componentDto = PostComponentDtoTranslator.fromApplicationDto(postApplicationDto, 'en')

        expect(componentDto.description).toStrictEqual('Some expected english description')
      })

      it('should set the default description if translation does not exist', () => {
        const componentDto = PostComponentDtoTranslator.fromApplicationDto(postApplicationDto, 'es')

        expect(componentDto.description).toStrictEqual('expected-post-description')
      })
    })
  })
})
