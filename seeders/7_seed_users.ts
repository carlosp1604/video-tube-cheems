import { Knex } from 'knex'
import { BcryptCryptoService } from '../helpers/Infrastructure/BcryptCryptoService'

export async function seed (knex: Knex): Promise<void> {
// Deletes ALL existing entries
  await knex('users').del()

  const password = await (new BcryptCryptoService().hash('password'))

  // Inserts seed entries
  await knex('users').insert([
    // eslint-disable-next-line max-len
    { id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', name: 'Admin', username: 'admin', email: 'admin@test.org', password, language: 'es', image_url: 'https://www.w3schools.com/howto/img_avatar.png' },
    // eslint-disable-next-line max-len
    { id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', name: 'Root', username: 'root', email: 'root@test.org', password, language: 'es', image_url: 'https://www.w3schools.com/howto/img_avatar.png' },
    // eslint-disable-next-line max-len
    { id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', name: 'SuperUser', username: 'super_user', email: 'super_user@test.org', password, language: 'es', image_url: 'https://www.w3schools.com/howto/img_avatar.png' },
  ])
}
