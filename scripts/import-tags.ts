import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'
import { Translation } from '~/modules/Translations/Domain/Translation'
import { MysqlPostTagRepository } from '~/modules/PostTag/Infrastructure/MysqlPostTagRepository'

const tagRepository = new MysqlPostTagRepository()

const findOrCreateTag = async (tag: any): Promise<void> => {
  console.log(`  - Finding tag with slug: ${tag.slug}`)

  const tagExists = await tagRepository.findBySlug(tag.slug)

  if (tagExists) {
    console.log(`\t- Tag with slug: ${tag.slug} already exists. Skipping`)

    return
  }

  console.log(`\t- Building tag with slug: ${tag.slug}`)

  const nowDate = DateTime.now()
  const tagUuid = randomUUID()

  const translationsCollection :Collection<Translation, string> = Collection.initializeCollection()

  console.log(`\t  - Building translations for tag with slug: ${tag.slug}`)

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

  console.log('\t  - Translations built')

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

    console.log(`\t- Tag with slug: ${newTag.slug} saved`)
  } catch (exception: unknown) {
    console.error(`\t- Cannot save tag with slug: ${newTag.slug}`)
    console.error(exception)
  }
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

async function run () {
  const tags = fs.readFileSync('data/tags-to-import.json', 'utf-8')
  const tagsToImport = JSON.parse(tags)

  console.log(`- Processing [${tagsToImport.length}] tags`)

  let index = 1

  for (const tag of tagsToImport) {
    await findOrCreateTag(tag)
    console.log(`  - Tag with slug: ${tag.slug} [${index}/${tagsToImport.length}] processed\n`)
    index++
  }

  process.exit()
}

run()
