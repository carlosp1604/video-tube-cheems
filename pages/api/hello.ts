import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../modules/Auth/Domain/User'
import { DateTime } from 'luxon'
import { MysqlUserRepository } from '../../modules/Auth/Infrastructure/MysqlUserRepository'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | null>
) {
  const user = new User(
    '114',
    'asdas',
    'test2@email.es',
    null,
    0,
    'es',
    DateTime.now(),
    DateTime.now(),
    null,
    null
  )

  const mysqlUserRepo = new MysqlUserRepository()
  await mysqlUserRepo.insert(user, 'hola')

  const foundUser = await mysqlUserRepo.findById('113')

  // const result = await (
  //   new MysqlPostRepository()
  //     .findWithOffsetAndLimit(
  //       1,
  //       1,
  //       'date_asc',
  //       {
  //         type: 'title',
  //         value: '8'
  //       })
  //)

  return res.status(200).json(foundUser)
}
