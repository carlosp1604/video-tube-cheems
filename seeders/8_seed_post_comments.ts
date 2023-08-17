import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('post_comments').del()

  // Inserts seed entries
  await knex('post_comments').insert([
    { id: 'cc3bd237-f420-428d-864a-899e419a77d7', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: 'c9401c52-502a-4039-8d97-ed40dcd512c6', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '64a9774c-ca40-41a4-9cfe-6d52afaea459', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: null, user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', parent_comment_id: 'c9401c52-502a-4039-8d97-ed40dcd512c6' },
    { id: 'abf36b5e-7eb6-44ac-b6b2-73ee99010182', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '1d57216d-1a91-4ee7-b4a5-ac56cf89d010', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: 'd874d6c5-df08-4840-90b2-a45a6c758ad3', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '65adcf81-ad13-49d7-91bc-36bda1fe71ee', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
    { id: '0d9827b7-04c8-4bb7-afb3-5de5dc4958c8', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: '292e252b-77e2-4c70-a10c-cc637f8747ba', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'cd57216d-1a91-4ee7-b4a5-ac56cf89d012', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: 'eef1da77-b3bf-4621-9234-75daba25d521', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
    { id: '398be03a-b188-4988-9587-6aebd76e5d05', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'dd57216d-1a91-4ee7-b4a5-ac56cf89d013', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: '4e768d6c-7429-4d19-b34a-edb76b79152c', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'ed57216d-1a91-4ee7-b4a5-ac56cf89d014', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '79e79059-fa26-4937-965e-8af0aeece472', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d015', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
    { id: '0e4729cb-cb03-467f-922f-f5ec8a75c494', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'd57216d1-1a91-4ee7-b4a5-ac56cf89d016', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: '60658959-4fec-42e7-a505-02a48e7b428c', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'ad57216d-1a91-4ee7-b4a5-ac56cf89d017', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '10c7eb50-3f95-4e9e-82d5-8a51c5500584', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '2d57216d-1a91-4ee7-b4a5-ac56cf89d019', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
    { id: 'a55c8b74-171a-4d26-a1e9-4338a84429b3', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '4d57216d-1a91-4ee7-b4a5-ac56cf89d020', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: 'e4dcb425-d61e-4953-968b-e937562fb138', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '5d57216d-1a91-4ee7-b4a5-ac56cf89d021', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '1c20ad40-3b0f-4d52-8e93-56b934dcc078', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '6d57216d-1a91-4ee7-b4a5-ac56cf89d022', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
    { id: 'f7cf0c6d-30b1-41c3-ba1b-ef4b24aff958', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '8d57216d-1a91-4ee7-b4a5-ac56cf89d024', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: 'fa02b44b-ffcc-4ac1-9dd6-2259f9a0c81b', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: '9d57216d-1a91-4ee7-b4a5-ac56cf89d025', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '3268279c-12b0-4f77-bf37-c2dd2170bf6f', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fa57216d-1a91-4ee7-b4a5-ac56cf89d026', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
    { id: '8fe1d8c3-e0ae-49b1-bec5-d753aa9fcf63', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fc57216d-1a91-4ee7-b4a5-ac56cf89d028', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: '68788add-2d63-4967-8976-ca8c0a12a4fa', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fd57216d-1a91-4ee7-b4a5-ac56cf89d029', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '99d73020-6ee7-4bbf-a404-ef68f310bcb4', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fe57216d-1a91-4ee7-b4a5-ac56cf89d030', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
    { id: 'dcfc6579-bec9-45f9-ad43-bc0252582d51', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'ff57216d-1a91-4ee7-b4a5-ac56cf89d031', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: '89854c92-a999-4b06-8c49-1be6ebe45398', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fda7216d-1a91-4ee7-b4a5-ac56cf89d032', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '354b0fce-4069-40d1-acbe-74fbfd178c6c', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fdb7216d-1a91-4ee7-b4a5-ac56cf89d033', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
    { id: '954b0fcd-4069-40d1-acbe-74fbfd178c78', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fdc7216d-1a91-4ee7-b4a5-ac56cf89d034', user_id: 'a05ac6d3-43cb-44cd-adf0-69649294f875' },
    { id: '26f9547f-aa78-4211-a792-1edd1e2150c3', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fde7216d-1a91-4ee7-b4a5-ac56cf89d036', user_id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6' },
    { id: '76f1ad7f-3138-473f-b883-1abe7a66e50c', comment: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', post_id: 'fdf7216d-1a91-4ee7-b4a5-ac56cf89d037', user_id: 'a315f624-c172-438b-9d3e-66ae564bd5bc' },
  ])
}
