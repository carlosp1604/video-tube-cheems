import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import {MysqlPostRepository} from "~/modules/Posts/Infrastructure/MysqlPostRepository";
import {Post} from "~/modules/Posts/Domain/Post";
import {PostMedia, PostMediaType} from "~/modules/Posts/Domain/PostMedia/PostMedia";
import {MediaUrl, MediaUrlType} from "~/modules/Posts/Domain/PostMedia/MediaUrl";
import {Collection} from "~/modules/Shared/Domain/Relationship/Collection";

const postRepository = new MysqlPostRepository()

const getPostBySlug = async (post: any): Promise<Post | null> => {
  console.log(`  - Finding post with slug: ${post.slug}`)

  return await postRepository.getPostBySlugWithPostMedia(post.slug)
}

async function run () {
  const posts = fs.readFileSync('data/posts-to-update.json', 'utf-8')
  const postsToUpdate = JSON.parse(posts)

  console.log(`- Processing [${postsToUpdate.length}] posts`)

  let index = 1

  for (const post of postsToUpdate) {
    console.log(`  - Starting to process post with slug: ${post.slug} [${index}/${postsToUpdate.length}]\n`)

    const postExists = await getPostBySlug(post)

    if (!postExists) {
      console.log(`\t- Post with slug: ${post.slug} does NOT EXIST...`)
      index++

      continue
    }

    console.log(`  - Starting to update post media for post with slug: ${post.slug}\n`)

    const currentPostMedia = postExists.postMedia

    // Find for current embed post media
    let embedPostMedia: PostMedia | null = null
    const embedPostMediaExist = currentPostMedia.find((postMedia) => {
      return postMedia.type === PostMediaType.EMBED
    })

    if (embedPostMediaExist) {
      embedPostMedia = embedPostMediaExist
    }

    // If we must delete embed post media
    if (Object.keys(post.videoUrls).length === 0) {
      if (embedPostMedia) {
        postExists.deletePostMedia(embedPostMedia)

        console.log(`\t- Post with slug: ${post.slug} will delete its media embed urls`)
      }
    } else {
      // Replace whole post media
      let postMediaUuid: string = randomUUID()
      const nowDate = DateTime.now()
      const newMediaUrlsCollection : Collection<MediaUrl, MediaUrl['url'] & string> =
        Collection.initializeCollection()

      for (const key in post.videoUrls) {
        const value = post.videoUrls[key]

        if (value !== null) {
          console.log(`\t- Building mediaUrls for provider ${key} for post with slug ${post.slug}`)

          if (value.downloadUrl && value.downloadUrl !== '') {
            const downloadUrl = new MediaUrl(
              `${value.title}`,
              value.providerData.id,
              postMediaUuid,
              value.downloadUrl,
              MediaUrlType.DOWNLOAD_URL,
              nowDate,
              nowDate
            )

            newMediaUrlsCollection.addItem(downloadUrl, downloadUrl.url + downloadUrl.type)
          }

          if (value.embed && value.embed !== '') {
            const embedUrl = new MediaUrl(
              `${value.title}`,
              value.providerData.id,
              postMediaUuid,
              value.embed,
              MediaUrlType.ACCESS_URL,
              nowDate,
              nowDate
            )

            newMediaUrlsCollection.addItem(embedUrl, embedUrl.url + embedUrl.type)
          }

          console.log('\t- Done')
        }
      }

      const newPostMedia = new PostMedia(
        postMediaUuid,
        PostMediaType.EMBED,
        '',
        postExists.id,
        post.thumb,
        nowDate,
        nowDate,
        newMediaUrlsCollection
      )

      postExists.addPostMedia(newPostMedia)

      if (embedPostMedia) {
        postExists.deletePostMedia(embedPostMedia)
      }
    }

    try {
      await postRepository.updatePostBySlugWithPostMedia(postExists)
    } catch (exception: unknown) {
      console.error(`  - Cannot update post with slug ${post.slug} in the database. Aborting...`)
      console.error(`  - ERROR: ${exception}\n\n`)
      index++

      continue
    }

    console.log(`  - Post with slug: ${post.slug} [${index}/${postsToUpdate.length}]\n processed`)
    index++
  }

  process.exit()
}

run()
