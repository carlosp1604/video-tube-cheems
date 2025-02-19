import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import {
  REPORT_CREATE_REPORT_POST_NOT_FOUND,
  REPORT_CREATE_REPORT_USER_NOT_FOUND
} from '~/modules/Reports/Infrastructure/Api/ReportApiExceptionCodes'

export class ReportsApiService {
  public async create (
    postId: string,
    content: string
  ): Promise<void> {
    let response

    try {
      response = await fetch(`/api/posts/${postId}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      })
    } catch (exception: unknown) {
      console.error(exception)
      throw new APIException(
        'server_error_error_message',
        500,
        'unexpected-exception'
      )
    }

    if (!response.ok) {
      const jsonResponse = await response.json()

      switch (response.status) {
        case 400:
          throw new APIException(
            'bad_request_error_message',
            response.status,
            jsonResponse.code
          )

        case 404: {
          switch (jsonResponse.code) {
            case REPORT_CREATE_REPORT_POST_NOT_FOUND:
              throw new APIException(
                'post_not_found_error_message',
                response.status,
                jsonResponse.code
              )

            case REPORT_CREATE_REPORT_USER_NOT_FOUND:
              throw new APIException(
                'user_not_found_error_message',
                response.status,
                jsonResponse.code
              )

            default:
              throw new APIException(
                'server_error_error_message',
                response.status,
                jsonResponse.code
              )
          }
        }

        case 409:
          throw new APIException(
            'user_already_reported_post_error_message',
            response.status,
            jsonResponse.code
          )

        case 401:
          throw new APIException(
            'user_must_be_authenticated_error_message',
            response.status,
            jsonResponse.code
          )

        default:
          throw new APIException(
            'server_error_error_message',
            response.status,
            jsonResponse.code
          )
      }
    }
  }
}
