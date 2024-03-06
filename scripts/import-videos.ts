import * as fs from 'fs'
import { Post } from '~/modules/Posts/Domain/Post'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { Actor } from '~/modules/Actors/Domain/Actor'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { PostMedia, PostMediaType } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import { MediaUrl, MediaUrlType } from '~/modules/Posts/Domain/PostMedia/MediaUrl'
import { MysqlProducerRepository } from '~/modules/Producers/Infrastructure/MysqlProducerRepository'
import { MysqlPostRepository } from '~/modules/Posts/Infrastructure/MysqlPostRepository'
import { MysqlActorRepository } from '~/modules/Actors/Infrastructure/MysqlActorRepository'
import { MysqlPostTagRepository } from '~/modules/PostTag/Infrastructure/MysqlPostTagRepository'

const producerRepository = new MysqlProducerRepository()
const postRepository = new MysqlPostRepository()
const actorRepository = new MysqlActorRepository()
const tagRepository = new MysqlPostTagRepository()

const findOrCreateActor = async (actor: any): Promise<Actor | null> => {
  console.log(`  - Finding actor with slug: ${actor.slug}`)

  const actorExists = await actorRepository.findBySlug(actor.slug)

  if (actorExists) {
    console.log(`\t- Actor with tag: ${actor.slug} found`)

    return actorExists
  }

  console.log(`\t- Actor not found. Building actor with slug: ${actor.slug}`)

  const nowDate = DateTime.now()

  const newActor = new Actor(
    randomUUID(),
    actor.slug,
    actor.name,
    actor.description ?? null,
    actor.image_url,
    nowDate,
    nowDate,
    null
  )

  try {
    await actorRepository.save(newActor)

    console.log(`\t- Actor with slug: ${actor.slug} saved`)

    return newActor
  } catch (exception: unknown) {
    console.error(`\t- Cannot save actor with slug: ${actor.slug} `)
    console.error(exception)

    return null
  }
}

const findOrCreateTag = async (tag: any): Promise<PostTag | null> => {
  console.log(`  - Finding tag with slug: ${tag.slug}`)

  const tagExists = await tagRepository.findBySlug(tag.slug)

  if (tagExists) {
    console.log(`\t- Tag with slug: ${tag.slug} found`)

    return tagExists
  }
  console.log(`\t- Tag not found. Building tag with slug: ${tag.slug}`)

  const nowDate = DateTime.now()
  const tagUuid = randomUUID()

  const translationsCollection :Collection<Translation, string> = Collection.initializeCollection()

  console.log(`\t  - Building tag translations: ${tag.slug}`)
  for (const language in tag.translations) {
    for (const field in tag.translations[language]) {
      const newTranslation = buildTranslation(
        field,
        language,
        tag.translations[language][field],
        tagUuid,
        'PostTag'
      )

      translationsCollection.addItem(newTranslation, newTranslation.language + newTranslation.field)
    }
  }

  const newTag = new PostTag(
    randomUUID(),
    tag.slug,
    tag.name,
    tag.description ?? null,
    tag.image ?? null,
    nowDate,
    nowDate,
    null,
    translationsCollection
  )

  try {
    await tagRepository.save(newTag)

    console.log(`\t- Tag with slug: ${tag.slug} saved`)

    return newTag
  } catch (exception: unknown) {
    console.error(`\t- Cannot save tag with slug: ${tag.slug} `)
    console.error(exception)

    return null
  }
}

const findOrCreateProducer = async (video: any): Promise<Producer | null> => {
  if (video.producer) {
    console.log(`  - Finding producer with slug ${video.producer.slug}`)
    const producer = await producerRepository.findBySlug(video.producer.slug)

    if (producer) {
      console.log('\t- Found')

      return producer
    }

    console.log(`\t- Producer not found. Building producer with slug: ${video.producer.slug}`)

    const nowDate = DateTime.now()

    const newProducer = new Producer(
      randomUUID(),
      video.producer.slug,
      video.producer.name,
      video.producer.description ?? null,
      video.producer.img,
      // TODO: Add support for producers hierarchy
      null,
      video.producer.brandHexColor,
      nowDate,
      nowDate,
      null
    )

    try {
      await producerRepository.save(newProducer)

      console.log(`\t- Producer with slug: ${video.producer.slug} saved`)

      return newProducer
    } catch (exception: unknown) {
      console.error(`\t- Cannot save producer with slug: ${video.producer.slug} `)
      console.error(exception)

      return null
    }
  }

  console.log(`  - Post with slug: ${video.slug} does not have producer`)

  return null
}

const buildMeta = (
  type: string,
  value: string,
  postUuid: string
): PostMeta => {
  const nowDate = DateTime.now()

  return new PostMeta(
    type,
    value,
    postUuid,
    nowDate,
    nowDate,
    null
  )
}

const buildTranslation = (
  field: string,
  language: string,
  value: string,
  translatableId: string,
  translatableType: string
): Translation => {
  const nowDate = DateTime.now()

  return new Translation(
    translatableId,
    translatableType,
    field,
    value,
    language,
    nowDate,
    nowDate
  )
}

async function run (
) {
  const videos = fs.readFileSync('data/videos-to-import.json', 'utf-8')
  const videosToImport = JSON.parse(videos)

  for (const video of videosToImport) {
    console.log(`- Processing post with slug ${video.slug}`)

    /**
     * Step 1:
     * Get producer and actor from database
     * If producer not found -> we set producerId to null
     * If producer not found -> we set actorId to null
     *
     **/
    const postProducer = await findOrCreateProducer(video)
    const producerRelationship: Relationship<Producer | null> = Relationship.initializeRelation(postProducer)

    let postActor: Actor | null = null
    let actorRelationship: Relationship<Actor | null> = Relationship.initializeRelation(postActor)

    if (video.actor) {
      console.log(`  - Post with slug ${video.slug} has an actor with slug ${video.actor.slug} as producer`)
      postActor = await findOrCreateActor(video.actor)
      actorRelationship = Relationship.initializeRelation(postActor)
    }

    /**
     * Step 2: TODO: Add support to get dates from input data
     * Build post and save it on database
     * If post already exists or another error occurred -> continue
     *
     **/
    console.log(`  - Building post meta collection for post with slug ${video.slug}`)

    const nowDate = DateTime.now()
    const postUuid = randomUUID()

    /**
     * Step 2.1:
     * Build post meta and create its collection
     *
     **/
    const metaDuration = buildMeta('duration', String(video.duration), postUuid)
    const metaThumb = buildMeta('thumb', String(video.thumb), postUuid)
    const metaTrailer = buildMeta('trailer', `https://cdn.cheemsporn.com/${String(video.trailer)}`, postUuid)

    const metaCollection: Collection<PostMeta, PostMeta['type']> = Collection.initializeCollection()

    metaCollection.addItem(metaDuration, metaDuration.type)
    metaCollection.addItem(metaThumb, metaThumb.type)
    metaCollection.addItem(metaTrailer, metaTrailer.type)

    console.log('\t- Done')

    /**
     * Step 2.2:
     * Build tags and create its collection
     * We will find tag per tag to be sure it already exists on database
     *
     **/
    console.log(`  - Building tags collection for post with slug ${video.slug}`)

    const tagsCollection: Collection<PostTag, PostTag['id']> = Collection.initializeCollection()

    if (video.videoTags.length === 0) {
      console.log('\t- Post has not tags')
    } else {
      for (const tag of video.videoTags) {
        const postTag = await findOrCreateTag(tag)

        if (postTag) {
          tagsCollection.addItem(postTag, postTag.id)
        }
      }

      console.log('\t- Done')
    }

    /**
     * Step 2.3: TODO: Add support when we have to add a new actor to database
     * Build actors and create its collection
     * We will find actor per actor to be sure it already exists on database
     *
     **/
    console.log(`  - Building actors collection for post with slug ${video.slug}`)

    const actorsCollection: Collection<Actor, Actor['id']> = Collection.initializeCollection()

    if (video.videoActors.length === 0) {
      console.log('\t- Post has not actors')
    } else {
      for (const actor of video.videoActors) {
        const postActor = await findOrCreateActor(actor)

        if (postActor) {
          actorsCollection.addItem(postActor, postActor.id)
        }
      }

      console.log('\t- Done')
    }

    /**
     * Step 2.4:
     * Build translations and create its collection
     *
     **/
    console.log(`  - Building translations collection for post with slug ${video.slug}`)

    const translationsCollection: Collection<Translation, Translation['language'] & Translation['field']> =
      Collection.initializeCollection()

    for (const language in video.translations) {
      for (const field in video.translations[language]) {
        const newTranslation = buildTranslation(
          field,
          language,
          video.translations[language][field],
          postUuid,
          'Post'
        )

        translationsCollection.addItem(newTranslation, newTranslation.language + newTranslation.field)
      }
    }
    console.log('\t- Done')

    /**
     * Step 2.5: TODO: Add title
     * Build PostMedia and PostMediaUrls and create its collection
     *
     **/
    console.log(`  - Building postMedia collection for post with slug ${video.slug}`)

    const postMediaCollection: Collection<PostMedia, PostMedia['id']> = Collection.initializeCollection()

    const postMediaUuid = randomUUID()
    const mediaUrlsCollection : Collection<MediaUrl, MediaUrl['url'] & string> = Collection.initializeCollection()

    for (const key in video.videoUrls) {
      const value = video.videoUrls[key]

      if (value !== null) {
        console.log(`\t- Building mediaUrls for provider ${key} for post with slug ${video.slug}`)

        let providerId = ''

        if (value.id) {
          providerId = value.id
        }

        if (value.providerData) {
          providerId = value.providerData.id
        }

        if (value.downloadUrl && value.downloadUrl !== '') {
          const downloadUrl = new MediaUrl(
            `${value.title}`,
            providerId,
            postMediaUuid,
            value.downloadUrl,
            MediaUrlType.DOWNLOAD_URL,
            nowDate,
            nowDate
          )

          mediaUrlsCollection.addItem(downloadUrl, downloadUrl.url)
        }

        if (value.embed && value.embed !== '') {
          const embedUrl = new MediaUrl(
            `${value.title}`,
            providerId,
            postMediaUuid,
            value.embed,
            MediaUrlType.ACCESS_URL,
            nowDate,
            nowDate
          )

          mediaUrlsCollection.addItem(embedUrl, embedUrl.url)
        }

        console.log('\t- Done')
      }
    }

    const postMedia = new PostMedia(
      postUuid,
      PostMediaType.EMBED,
      '',
      postUuid,
      video.thumb,
      nowDate,
      nowDate,
      mediaUrlsCollection
    )

    postMediaCollection.addItem(postMedia, postMedia.id)

    /** TODO: Finish this code **/
    if (video.direct) {
      console.log(`\t- Building mediaUrls for provider ${video.direct.title} for post with slug ${video.slug}`)
      const mediaUrlsCollection : Collection<MediaUrl, MediaUrl['url'] & string> = Collection.initializeCollection()

      const directPostMediaUuid = randomUUID()

      const directPostMedia = new PostMedia(
        directPostMediaUuid,
        PostMediaType.VIDEO,
        '',
        postUuid,
        video.thumb,
        nowDate,
        nowDate,
        mediaUrlsCollection
      )

      /**
       * Not included for the moment
       *
      const downloadUrl = new MediaUrl(
        `${video.direct.title}`,
        video.direct.id,
        postMediaUuid,
        video.direct.downloadUrl,
        MediaUrlType.DOWNLOAD_URL,
        nowDate,
        nowDate
      )

      mediaUrlsCollection.addItem(downloadUrl, downloadUrl.url) */

      const embedUrl = new MediaUrl(
        `${video.direct.title}`,
        video.direct.providerData.id,
        postMediaUuid,
        video.direct.embed,
        MediaUrlType.ACCESS_URL,
        nowDate,
        nowDate
      )

      mediaUrlsCollection.addItem(embedUrl, embedUrl.url)

      postMediaCollection.addItem(directPostMedia, directPostMedia.id)
    }

    console.log(`  - Post media for post with slug: ${video.slug} built`)

    const post = new Post(
      postUuid,
      video.title,
      video.type,
      video.description,
      video.slug,
      postProducer !== null ? postProducer.id : null,
      postActor !== null ? postActor.id : null,
      nowDate,
      nowDate,
      null,
      video.publishDate ? DateTime.fromISO(video.publishDate) : nowDate,
      metaCollection,
      tagsCollection,
      actorsCollection,
      Collection.initializeCollection(),
      Collection.initializeCollection(),
      Collection.initializeCollection(),
      producerRelationship,
      translationsCollection,
      actorRelationship,
      postMediaCollection
    )

    try {
      await postRepository.save(post)
    } catch (exception: unknown) {
      console.error(`  - Cannot save post with slug ${post.slug} in the database. Aborting...`)
      console.error(`  - ERROR: ${exception}\n\n`)
      continue
    }

    console.log(`  - Post with slug ${video.slug} saved`)
  }

  process.exit()
}

run()
