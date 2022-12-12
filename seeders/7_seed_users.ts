import { Knex } from 'knex'
import { BcryptCryptoService } from '../helpers/Infrastructure/BcryptCryptoService'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('users').del()

    const password = await (new BcryptCryptoService().hash('password'))

    // Inserts seed entries
    await knex('users').insert([
        { id: 'a05ac6d3-43cb-44cd-adf0-69649294f875', name: 'Admin', email: 'admin@test.org', password: password, language: 'es', image_url: 'https://www.w3schools.com/howto/img_avatar.png' },
        { id: 'cbcc5183-18b6-4a50-8edb-60bda55504f6', name: 'Root', email: 'root@test.org', password: password, language: 'es', image_url: 'https://www.w3schools.com/howto/img_avatar.png' },
        { id: 'a315f624-c172-438b-9d3e-66ae564bd5bc', name: 'SuperUser', email: 'super_user@test.org', password: password, language: 'es', image_url: 'https://www.w3schools.com/howto/img_avatar.png' },
    ])
}
