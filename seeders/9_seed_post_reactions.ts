import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('post_reactions').del()

  // Inserts seed entries
  await knex('post_reactions').insert([
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', reaction_type: 'like' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', reaction_type: 'like' },
    { post_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', reaction_type: 'like' },
    { post_id: 'ed57216d-1a91-4ee7-b4a5-ac56cf89d014', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', reaction_type: 'like' },
    { post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d015', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', reaction_type: 'like' },
    { post_id: 'd57216d1-1a91-4ee7-b4a5-ac56cf89d016', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', reaction_type: 'like' },
    { post_id: 'ad57216d-1a91-4ee7-b4a5-ac56cf89d017', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', reaction_type: 'like' },
    { post_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d019', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', reaction_type: 'like' },
    { post_id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d020', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', reaction_type: 'like' },
    { post_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d021', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', reaction_type: 'like' },
    { post_id: '6d57216d-1a91-4ee7-b4a5-ac56cf89d022', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', reaction_type: 'like' },
    { post_id: '8d57216d-1a91-4ee7-b4a5-ac56cf89d024', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', reaction_type: 'like' },
    { post_id: '9d57216d-1a91-4ee7-b4a5-ac56cf89d025', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', reaction_type: 'like' },
    { post_id: 'fa57216d-1a91-4ee7-b4a5-ac56cf89d026', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', reaction_type: 'like' },
    { post_id: 'fc57216d-1a91-4ee7-b4a5-ac56cf89d028', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', reaction_type: 'like' },
    { post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d029', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', reaction_type: 'like' },
    { post_id: 'fe57216d-1a91-4ee7-b4a5-ac56cf89d030', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', reaction_type: 'like' },
    { post_id: 'ff57216d-1a91-4ee7-b4a5-ac56cf89d031', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', reaction_type: 'like' },
    { post_id: 'fda7216d-1a91-4ee7-b4a5-ac56cf89d032', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', reaction_type: 'like' },
    { post_id: 'fdb7216d-1a91-4ee7-b4a5-ac56cf89d033', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', reaction_type: 'like' },
    { post_id: 'fdc7216d-1a91-4ee7-b4a5-ac56cf89d034', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', reaction_type: 'like' },
    { post_id: 'fde7216d-1a91-4ee7-b4a5-ac56cf89d036', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', reaction_type: 'like' },
    { post_id: 'fdf7216d-1a91-4ee7-b4a5-ac56cf89d037', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', reaction_type: 'like' },
  ])
}
