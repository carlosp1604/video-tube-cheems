import { View as PrismaViewModel } from '@prisma/client'
import { View } from '~/modules/Views/Domain/View'
import { ViewableType } from '.prisma/client'

export class ViewModelTranslator {
  public static toDatabase (view: View): PrismaViewModel {
    return {
      id: view.id,
      viewableId: view.viewableId,
      viewableType: view.viewableType as ViewableType,
      userId: view.userId,
      createdAt: view.createdAt.toJSDate(),
    }
  }
}
