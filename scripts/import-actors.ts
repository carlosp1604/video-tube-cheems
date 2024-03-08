import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { MysqlActorRepository } from '~/modules/Actors/Infrastructure/MysqlActorRepository'
import { Actor } from '~/modules/Actors/Domain/Actor'

const actorRepository = new MysqlActorRepository()

const findOrCreateActor = async (actor: any): Promise<void> => {
  console.log(`  - Finding actor with slug: ${actor.slug}`)

  const actorExists = await actorRepository.findBySlug(actor.slug)

  if (actorExists) {
    console.log(`\t- Actor with slug: ${actor.slug} already exists. Skipping`)

    return
  }

  console.log(`\t- Building actor with slug: ${actor.slug}`)

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

    console.log(`\t- Actor with slug: ${newActor.slug} saved`)
  } catch (exception: unknown) {
    console.error(`\t- Cannot save actor with slug: ${newActor.slug} `)
    console.error(exception)
  }
}

async function run () {
  const actors = fs.readFileSync('data/actors-to-import.json', 'utf-8')
  const actorsToImport = JSON.parse(actors)

  console.log(`- Processing [${actorsToImport.length}] actors`)

  let index = 1

  for (const actor of actorsToImport) {
    await findOrCreateActor(actor)
    console.log(`  - Actor with slug: ${actor.slug} [${index}/${actorsToImport.length}] processed\n`)
    index++
  }

  process.exit()
}

run()
