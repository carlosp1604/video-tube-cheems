import { Knex } from 'knex'

/* eslint max-len: 0 */
export async function seed (knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('translations').insert([
    { translatable_id: 'f7e36146-0f18-4df1-aabe-372bb7461d03', translatable_type: 'PostTag', field: 'name', value: 'Acción', language: 'es' },
    { translatable_id: '6a0b1fe6-b794-4a2e-b55f-44541bb7f774', translatable_type: 'PostTag', field: 'name', value: 'Animación', language: 'es' },
    { translatable_id: '603a66a5-6c0b-438f-8567-f98d9cfd2db8', translatable_type: 'PostTag', field: 'name', value: 'Comedia', language: 'es' },
    { translatable_id: '6573f789-2759-4f03-b76a-1397e0e73f57', translatable_type: 'PostTag', field: 'name', value: 'Crimen', language: 'es' },
    { translatable_id: '4f2e0828-89ef-48fe-893d-d7bd9ac68bab', translatable_type: 'PostTag', field: 'name', value: 'Drama', language: 'es' },
    { translatable_id: 'cee05e5b-750b-4696-9791-6a6fc79feb8f', translatable_type: 'PostTag', field: 'name', value: 'Experimental', language: 'es' },
    { translatable_id: '0344f486-7326-45bb-b625-7ee393965fed', translatable_type: 'PostTag', field: 'name', value: 'Fantasía', language: 'es' },
    { translatable_id: '2980bc7c-ba38-4629-b256-04cc33a5ba5d', translatable_type: 'PostTag', field: 'name', value: 'Histórica', language: 'es' },
    { translatable_id: '5e83441c-0b36-4c48-bfc6-cbdcbdbb8e17', translatable_type: 'PostTag', field: 'name', value: 'Romance', language: 'es' },
    { translatable_id: 'a6e03c7a-4070-42d2-b98e-f344022c72d5', translatable_type: 'PostTag', field: 'name', value: 'Ciencia ficción', language: 'es' },
    { translatable_id: '41027445-4385-4b7f-a322-6a517769caed', translatable_type: 'PostTag', field: 'name', value: 'Thriller', language: 'es' },
    { translatable_id: '39df64f0-b298-4020-aebc-231bc25a8325', translatable_type: 'PostTag', field: 'name', value: 'Oeste', language: 'es' },
    { translatable_id: '415df2a2-bf78-4fdc-8f72-d476a2c58e41', translatable_type: 'PostTag', field: 'name', value: 'Horror', language: 'es' },
    { translatable_id: 'e17579cf-7ee8-409f-b426-9dde7f8db2c7', translatable_type: 'PostTag', field: 'name', value: 'Musical', language: 'es' },
    { translatable_id: '5f4e8cd0-532d-4601-a1e3-b7f1d6674060', translatable_type: 'PostTag', field: 'name', value: 'Deportes', language: 'es' },
    { translatable_id: 'b5d46889-9b90-4566-a7af-1f5963f6bf5a', translatable_type: 'PostTag', field: 'name', value: 'Zombies', language: 'es' },
    { translatable_id: '259b3c21-b89e-4d6e-a8d2-d49d8a23645c', translatable_type: 'PostTag', field: 'name', value: 'Super heroes', language: 'es' },
    { translatable_id: '08d44b5f-8f64-4bfa-b85b-bd6afb799b9e', translatable_type: 'PostTag', field: 'name', value: 'Drama de guerra', language: 'es' },
    { translatable_id: '91d9318d-e521-45b0-90d5-767afda180cf', translatable_type: 'PostTag', field: 'name', value: 'Acción', language: 'es' },
    { translatable_id: 'e3f9ba52-5cd6-48c8-a0ca-b555b86c6681', translatable_type: 'PostTag', field: 'name', value: 'Vídeo', language: 'es' },
    { translatable_id: 'd7134b7b-d1c1-4fa7-a62b-af1a5de5ae9a', translatable_type: 'PostTag', field: 'name', value: 'Sátira', language: 'es' },
    { translatable_id: '6b8cbcda-820e-4365-873d-dbba4b2ff494', translatable_type: 'PostTag', field: 'name', value: 'Especulativo', language: 'es' },
    { translatable_id: '804fd4f0-7cc0-4b66-b532-ba3cd34ae5a1', translatable_type: 'PostTag', field: 'name', value: 'Estrategia', language: 'es' },
    { translatable_id: '8b62b1ce-70d4-4d59-9b89-3d3105c829f3', translatable_type: 'PostTag', field: 'name', value: 'Otro', language: 'es' },
    { translatable_id: 'db75e0b0-f847-4e6c-ae54-86e5b4a5cedc', translatable_type: 'PostTag', field: 'name', value: 'Popular', language: 'es' },
    { translatable_id: 'af6cb56e-3f4c-4721-9da1-3b91cf61fbfa', translatable_type: 'PostTag', field: 'name', value: 'Rol', language: 'es' },
    { translatable_id: '55929049-96e9-4d6d-b30a-a959cd857290', translatable_type: 'PostTag', field: 'name', value: 'Música', language: 'es' },
    { translatable_id: '7b1a3cd7-180d-464c-8998-abac9ec0373a', translatable_type: 'PostTag', field: 'name', value: 'Crimen y misterio', language: 'es' },
  ])
}
