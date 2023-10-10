import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('video_providers').insert([
    { id: '2fef1a77-a1f8-42a3-9293-437a6f4fc5cc', name: 'Youtube', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052' },
    { id: 'd460ba6c-5b2e-4cc9-a09e-eda5d5a7e12c', name: 'Vimeo', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052' },
    { id: '0a635277-c262-4777-8833-caa37e6ec1a8', name: 'DailyMotion', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052' },
  ])
}
