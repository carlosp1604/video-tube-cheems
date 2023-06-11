import { NextPage } from 'next'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'

export interface UserProfilePageProps {
  userComponentDto: UserProfileHeaderComponentDto
}
export const UserProfilePage: NextPage<UserProfilePageProps> = ({ userComponentDto }) => {
  return (
    <UserProfileHeader
      componentDto={ userComponentDto }
    />
  )
}
