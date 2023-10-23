import { DeleteSavedPostApiRequest } from '~/modules/Auth/Infrastructure/Api/Requests/DeleteSavedPostApiRequest'
import {
  DeleteSavedPostApplicationRequest
} from '~/modules/Auth/Application/DeleteSavedPost/DeleteSavedPostApplicationRequest'

export class DeleteSavedPostApplicationRequestTranslator {
  public static fromApi (apiRequest: DeleteSavedPostApiRequest): DeleteSavedPostApplicationRequest {
    return {
      userId: apiRequest.userId,
      postId: apiRequest.postId,
    }
  }
}
