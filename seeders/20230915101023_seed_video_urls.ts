import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('video_urls').insert([
    { provider_id: '2fef1a77-a1f8-42a3-9293-437a6f4fc5cc', url: 'https://www.youtube.com/watch?v=_zhV166q_RA', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', type: 'Download' },
    { provider_id: 'd460ba6c-5b2e-4cc9-a09e-eda5d5a7e12c', url: 'https://vimeo.com/786334291', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', type: 'Download' },
    { provider_id: '0a635277-c262-4777-8833-caa37e6ec1a8', url: 'https://www.dailymotion.com/video/x8opu9r', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', type: 'Download' },
    { provider_id: '2fef1a77-a1f8-42a3-9293-437a6f4fc5cc', url: 'https://www.youtube.com/embed/_zhV166q_RA?si=7da_5-43po6dLgaM', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', type: 'Embed' },
    { provider_id: 'd460ba6c-5b2e-4cc9-a09e-eda5d5a7e12c', url: 'https://player.vimeo.com/video/786334291?h=b895fbda7e', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', type: 'Embed' },
    { provider_id: '0a635277-c262-4777-8833-caa37e6ec1a8', url: 'https://www.dailymotion.com/embed/video/x8opu9r?autoplay=1', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', type: 'Embed' },
  ])
}
