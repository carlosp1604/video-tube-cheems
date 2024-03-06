import * as fs from 'fs'
import { DateTime } from 'luxon'
import { prisma } from '~/persistence/prisma'
import { MediaProvider as PrismaMediaProvider } from '@prisma/client'
import { MediaProvider } from '~/modules/Posts/Domain/PostMedia/MediaProvider'

/**
 * WARNING: We must provide an ID to each provider present in the data/providers-to-import.json file
 * WARNING: We are using prisma instead of a repository
 * TODO: If MediaProvider repository methods grow up then use a repository
 */
const findOrCreateProvider = async (provider: any): Promise<void> => {
  console.log(`  - Finding provider with ID: ${provider.id}`)

  // We use prisma instead of a repository
  const providerExists: PrismaMediaProvider | null = await prisma.mediaProvider.findFirst({
    where: {
      id: provider.id,
    },
  })

  if (providerExists) {
    console.log(`\t- Provider with slug: ${providerExists.id} already exists. Skipping`)

    return
  }

  console.log(`\t- Building provider with ID: ${provider.id}`)

  const nowDate = DateTime.now()

  const newProvider = new MediaProvider(
    provider.id,
    provider.name,
    // TODO: Set a default image
    provider.logo_url ?? '',
    nowDate,
    nowDate
  )

  try {
    await prisma.mediaProvider.create({
      data: {
        createdAt: newProvider.createdAt.toJSDate(),
        updatedAt: newProvider.updatedAt.toJSDate(),
        name: newProvider.name,
        logoUrl: newProvider.logoUrl,
        id: newProvider.id,
      },
    })

    console.log(`\t- Provider with ID: ${provider.id} saved`)
  } catch (exception: unknown) {
    console.error(`\t- Cannot save provider with ID: ${provider.id} `)
    console.error(exception)
  }
}

async function run () {
  const providers = fs.readFileSync('data/providers-to-import.json', 'utf-8')
  const providersToImport = JSON.parse(providers)

  console.log(`- Processing [${providersToImport.length}] providers`)

  let index = 1

  for (const provider of providersToImport) {
    await findOrCreateProvider(provider)
    console.log(`  - Provider with ID: ${provider.id} [${index}/${providersToImport.length}] processed\n`)
    index++
  }

  process.exit()
}

run()
