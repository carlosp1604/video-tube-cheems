import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('post_post_tags').del()

  // Inserts seed entries
  await knex('post_post_tags').insert([
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', post_tag_id: 'f7e36146-0f18-4df1-aabe-372bb7461d03' },
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', post_tag_id: '6a0b1fe6-b794-4a2e-b55f-44541bb7f774' },
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', post_tag_id: '603a66a5-6c0b-438f-8567-f98d9cfd2db8' },
    { post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', post_tag_id: '0344f486-7326-45bb-b625-7ee393965fed' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', post_tag_id: '5f4e8cd0-532d-4601-a1e3-b7f1d6674060' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', post_tag_id: 'b5d46889-9b90-4566-a7af-1f5963f6bf5a' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', post_tag_id: '259b3c21-b89e-4d6e-a8d2-d49d8a23645c' },
    { post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', post_tag_id: '91d9318d-e521-45b0-90d5-767afda180cf' },
    { post_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', post_tag_id: '6573f789-2759-4f03-b76a-1397e0e73f57' },
    { post_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', post_tag_id: '0344f486-7326-45bb-b625-7ee393965fed' },
    { post_id: 'ed57216d-1a91-4ee7-b4a5-ac56cf89d014', post_tag_id: '4f2e0828-89ef-48fe-893d-d7bd9ac68bab' },
    { post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d015', post_tag_id: 'cee05e5b-750b-4696-9791-6a6fc79feb8f' },
    { post_id: 'd57216d1-1a91-4ee7-b4a5-ac56cf89d016', post_tag_id: '0344f486-7326-45bb-b625-7ee393965fed' },
    { post_id: 'ad57216d-1a91-4ee7-b4a5-ac56cf89d017', post_tag_id: '2980bc7c-ba38-4629-b256-04cc33a5ba5d' },
    { post_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d019', post_tag_id: 'a6e03c7a-4070-42d2-b98e-f344022c72d5' },
    { post_id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d020', post_tag_id: '41027445-4385-4b7f-a322-6a517769caed' },
    { post_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d021', post_tag_id: '39df64f0-b298-4020-aebc-231bc25a8325' },
    { post_id: '6d57216d-1a91-4ee7-b4a5-ac56cf89d022', post_tag_id: '415df2a2-bf78-4fdc-8f72-d476a2c58e41' },
    { post_id: '8d57216d-1a91-4ee7-b4a5-ac56cf89d024', post_tag_id: '5f4e8cd0-532d-4601-a1e3-b7f1d6674060' },
    { post_id: '9d57216d-1a91-4ee7-b4a5-ac56cf89d025', post_tag_id: 'b5d46889-9b90-4566-a7af-1f5963f6bf5a' },
    { post_id: 'fa57216d-1a91-4ee7-b4a5-ac56cf89d026', post_tag_id: '259b3c21-b89e-4d6e-a8d2-d49d8a23645c' },
    { post_id: 'fc57216d-1a91-4ee7-b4a5-ac56cf89d028', post_tag_id: '91d9318d-e521-45b0-90d5-767afda180cf' },
    { post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d029', post_tag_id: 'e3f9ba52-5cd6-48c8-a0ca-b555b86c6681' },
    { post_id: 'fe57216d-1a91-4ee7-b4a5-ac56cf89d030', post_tag_id: 'd7134b7b-d1c1-4fa7-a62b-af1a5de5ae9a' },
    { post_id: 'ff57216d-1a91-4ee7-b4a5-ac56cf89d031', post_tag_id: '6b8cbcda-820e-4365-873d-dbba4b2ff494' },
    { post_id: 'fda7216d-1a91-4ee7-b4a5-ac56cf89d032', post_tag_id: '804fd4f0-7cc0-4b66-b532-ba3cd34ae5a1' },
    { post_id: 'fdb7216d-1a91-4ee7-b4a5-ac56cf89d033', post_tag_id: '8b62b1ce-70d4-4d59-9b89-3d3105c829f3' },
    { post_id: 'fdc7216d-1a91-4ee7-b4a5-ac56cf89d034', post_tag_id: 'db75e0b0-f847-4e6c-ae54-86e5b4a5cedc' },
    { post_id: 'fde7216d-1a91-4ee7-b4a5-ac56cf89d036', post_tag_id: '55929049-96e9-4d6d-b30a-a959cd857290' },
    { post_id: 'fdf7216d-1a91-4ee7-b4a5-ac56cf89d037', post_tag_id: '7b1a3cd7-180d-464c-8998-abac9ec0373a' },
  ])
}
