import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { Producer } from '~/modules/Producers/Domain/Producer'
import { MysqlProducerRepository } from '~/modules/Producers/Infrastructure/MysqlProducerRepository'

const producerRepository = new MysqlProducerRepository()

const findOrCreateProducer = async (producer: any): Promise<void> => {
  console.log(`  - Finding producer with slug ${producer.slug}`)

  const producerExists = await producerRepository.findBySlug(producer.slug)

  if (producerExists) {
    console.log(`\t- Producer with slug: ${producer.slug} already exists. Skipping`)

    return
  }

  console.log(`\t- Building producer with slug: ${producer.slug}`)

  const nowDate = DateTime.now()

  const newProducer = new Producer(
    randomUUID(),
    producer.slug,
    producer.name,
    producer.description ?? null,
    producer.img,
    0,
    // TODO: Add support for producers hierarchy
    null,
    producer.brandHexColor,
    nowDate,
    nowDate,
    null
  )

  try {
    await producerRepository.save(newProducer)

    console.log(`\t- Producer with slug: ${newProducer.slug} saved`)
  } catch (exception: unknown) {
    console.error(`\t- Cannot save producer with slug: ${newProducer.slug} `)
    console.error(exception)
  }
}

async function run () {
  const producers = fs.readFileSync('data/producers-to-import.json', 'utf-8')
  const producersToImport = JSON.parse(producers)

  console.log(`- Processing [${producersToImport.length}] tags`)

  let index = 1

  for (const producer of producersToImport) {
    await findOrCreateProducer(producer)
    console.log(`  - Producer with slug: ${producer.slug} [${index}/${producersToImport.length}] processed\n`)
    index++
  }

  process.exit()
}

run()
