import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('post_actors').del()

  // Inserts seed entries
  await knex('post_actors').insert([
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', actor_id: '1bcd0b5c-cdd0-4484-9c6c-4724e8081c96' },
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', actor_id: 'c03de5ea-c024-47c7-b5f6-68047503134a' },
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', actor_id: 'cb08adfb-fd76-438e-a582-219b62ff6dcd' },
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', actor_id: '9d6f221a-05f7-4545-bfb8-9a178708421d' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', actor_id: '06362d28-873f-464d-a0fc-a05093f07bc3' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', actor_id: '8079e5fd-da6d-4aa7-8c9e-d73baa975ff9' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', actor_id: '351deea5-a66e-4cb2-99fa-0e33b9617bf2' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', actor_id: '1c6b056d-4ad2-4659-b2db-796d274f9913' },
    { post_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', actor_id: '49697497-0f32-442a-8895-aed02c849375' },
    { post_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', actor_id: 'e91cb6c4-957f-4966-b959-fc0b988c66b8' },
    { post_id: 'ed57216d-1a91-4ee7-b4a5-ac56cf89d014', actor_id: 'ef37b5b8-f382-409a-a38f-3b2a09abdbc7' },
    { post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d015', actor_id: 'fd28fdb2-a431-4480-8b01-48dce4e4c15a' },
    { post_id: 'd57216d1-1a91-4ee7-b4a5-ac56cf89d016', actor_id: '8354df3a-7adf-4528-b3b0-db35788b8739' },
    { post_id: 'ad57216d-1a91-4ee7-b4a5-ac56cf89d017', actor_id: 'da26c4f6-8d97-466f-aaf0-aa98e258750e' },
    { post_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d019', actor_id: '8dbf5cae-393e-478f-b44b-e7b9d0e67e2e' },
    { post_id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d020', actor_id: '1bcd0b5c-cdd0-4484-9c6c-4724e8081c96' },
    { post_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d021', actor_id: 'c03de5ea-c024-47c7-b5f6-68047503134a' },
    { post_id: '6d57216d-1a91-4ee7-b4a5-ac56cf89d022', actor_id: 'cb08adfb-fd76-438e-a582-219b62ff6dcd' },
    { post_id: '8d57216d-1a91-4ee7-b4a5-ac56cf89d024', actor_id: '9d6f221a-05f7-4545-bfb8-9a178708421d' },
    { post_id: '9d57216d-1a91-4ee7-b4a5-ac56cf89d025', actor_id: '06362d28-873f-464d-a0fc-a05093f07bc3' },
    { post_id: 'fa57216d-1a91-4ee7-b4a5-ac56cf89d026', actor_id: '8079e5fd-da6d-4aa7-8c9e-d73baa975ff9' },
    { post_id: 'fc57216d-1a91-4ee7-b4a5-ac56cf89d028', actor_id: '351deea5-a66e-4cb2-99fa-0e33b9617bf2' },
    { post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d029', actor_id: '1c6b056d-4ad2-4659-b2db-796d274f9913' },
    { post_id: 'fe57216d-1a91-4ee7-b4a5-ac56cf89d030', actor_id: '49697497-0f32-442a-8895-aed02c849375' },
    { post_id: 'ff57216d-1a91-4ee7-b4a5-ac56cf89d031', actor_id: 'e91cb6c4-957f-4966-b959-fc0b988c66b8' },
    { post_id: 'fda7216d-1a91-4ee7-b4a5-ac56cf89d032', actor_id: 'ef37b5b8-f382-409a-a38f-3b2a09abdbc7' },
    { post_id: 'fdb7216d-1a91-4ee7-b4a5-ac56cf89d033', actor_id: 'fd28fdb2-a431-4480-8b01-48dce4e4c15a' },
    { post_id: 'fdc7216d-1a91-4ee7-b4a5-ac56cf89d034', actor_id: '8354df3a-7adf-4528-b3b0-db35788b8739' },
    { post_id: 'fde7216d-1a91-4ee7-b4a5-ac56cf89d036', actor_id: 'da26c4f6-8d97-466f-aaf0-aa98e258750e' },
    { post_id: 'fdf7216d-1a91-4ee7-b4a5-ac56cf89d037', actor_id: '8dbf5cae-393e-478f-b44b-e7b9d0e67e2e' },
  ])
}
