import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import {
  POST_COMMENT_COMMENT_NOT_FOUND, POST_COMMENT_PARENT_COMMENT_NOT_FOUND,
  POST_COMMENT_POST_NOT_FOUND,
  POST_COMMENT_REACTION_NOT_FOUND,
  POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND,
  POST_COMMENT_REACTION_USER_NOT_FOUND,
  POST_COMMENT_USER_NOT_FOUND
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { PostCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostCommentApplicationDto'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'
import {
  GetPostPostChildCommentsResponseDto
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsResponseDto'

export class CommentsApiService {
  public async create (
    postId: string,
    comment: string,
    parentCommentId: string | null
  ): Promise<PostCommentApplicationDto> {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment,
        parentCommentId,
      }),
    })

    const jsonResponse = await response.json()

    if (response.ok) {
      return jsonResponse as PostCommentApplicationDto
    }

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 401:
        throw new APIException(
          'user_must_be_authenticated_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_POST_NOT_FOUND:
            throw new APIException(
              'post_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_USER_NOT_FOUND:
            throw new APIException(
              'post_user_not_found_error_message',
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

      default:
        throw new APIException(
          'server_error_error_message',
          response.status,
          jsonResponse.code
        )
    }
  }

  public async createReply (
    postId: string,
    comment: string,
    parentCommentId: string
  ): Promise<PostChildCommentApplicationDto> {
    const response = await fetch(`/api/posts/${postId}/comments/${parentCommentId}/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    })

    const jsonResponse = await response.json()

    if (response.ok) {
      return jsonResponse as PostChildCommentApplicationDto
    }

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 401:
        throw new APIException(
          'user_must_be_authenticated_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_POST_NOT_FOUND:
            throw new APIException(
              'create_post_child_comment_post_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_PARENT_COMMENT_NOT_FOUND:
            throw new APIException(
              'create_post_child_comment_parent_comment_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_USER_NOT_FOUND:
            throw new APIException(
              'post_user_not_found_error_message',
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

      default:
        throw new APIException(
          'server_error_error_message',
          response.status,
          jsonResponse.code
        )
    }
  }

  public async delete (
    postId: string,
    postCommentId: string,
    parentCommentId: string | null
  ): Promise<void> {
    let fetchRoute = `/api/posts/${postId}/comments/${postCommentId}`

    if (parentCommentId !== null) {
      fetchRoute = `/api/posts/${postId}/comments/${parentCommentId}/children/${postCommentId}`
    }

    const response = await fetch(fetchRoute, {
      method: 'DELETE',
    })

    if (response.ok) {
      return
    }

    const jsonResponse = await response.json()

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 401:
        throw new APIException(
          'user_must_be_authenticated_error_message',
          response.status,
          jsonResponse.code
        )

      case 403:
        throw new APIException(
          'delete_post_comment_does_not_belong_to_user_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_POST_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_post_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_PARENT_COMMENT_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_parent_comment_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_COMMENT_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_post_comment_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_USER_NOT_FOUND:
            throw new APIException(
              'post_user_not_found_error_message',
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

      case 409:
        throw new APIException(
          'delete_post_comment_post_comment_cannot_be_deleted_error_message',
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

  public async getComments (
    postId: string,
    pageNumber: number,
    perPage: number = defaultPerPage
  ): Promise<GetPostPostCommentsResponseDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())

    const response = await fetch(`/api/posts/${postId}/comments?${params}`)

    const jsonResponse = await response.json()

    if (response.ok) {
      return jsonResponse as GetPostPostCommentsResponseDto
    }

    /**
     * Currently, we don't handle the possible error since is not possible
     * for user to manipulate the request, so simply we return a 500
     */

    throw new APIException(
      'server_error_error_message',
      response.status,
      jsonResponse.code
    )
  }

  public async getChildComments (
    postId: string,
    parentCommentId: string,
    pageNumber: number,
    perPage: number = defaultPerPage
  ): Promise<GetPostPostChildCommentsResponseDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())

    const response = await fetch(`/api/posts/${postId}/comments/${parentCommentId}/children?${params}`)

    const jsonResponse = await response.json()

    if (response.ok) {
      return jsonResponse as GetPostPostChildCommentsResponseDto
    }

    /**
     * Currently, we don't handle the possible error since is not possible
     * for user to manipulate the request, so simply we return a 500
     */

    throw new APIException(
      'server_error_error_message',
      response.status,
      jsonResponse.code
    )
  }

  public async createPostCommentReaction (postCommentId: string): Promise<ModelReactionApplicationDto> {
    const response = await fetch(`/api/comments/${postCommentId}/reactions`, {
      method: 'POST',
    })

    const jsonResponse = await response.json()

    if (response.ok) {
      return jsonResponse as ModelReactionApplicationDto
    }

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 401:
        throw new APIException(
          'user_must_be_authenticated_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_REACTION_USER_NOT_FOUND:
            throw new APIException(
              'post_user_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND:
            throw new APIException(
              'create_post_comment_reaction_post_comment_not_found_error_message',
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

      case 409:
        throw new APIException(
          'create_post_comment_reaction_user_already_reacted_error_message',
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

  public async deletePostCommentReaction (postCommentId: string): Promise<void> {
    const response = await fetch(`/api/comments/${postCommentId}/reactions`, {
      method: 'DELETE',
    })

    if (response.ok) {
      return
    }

    const jsonResponse = await response.json()

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 401:
        throw new APIException(
          'user_must_be_authenticated_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_reaction_post_comment_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_REACTION_USER_NOT_FOUND:
            throw new APIException(
              'post_user_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_REACTION_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_reaction_user_has_not_reacted_error_messaged',
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

      default:
        throw new APIException(
          'server_error_error_message',
          response.status,
          jsonResponse.code
        )
    }
  }

  public async createPostChildCommentReaction (
    postCommentId: string,
    parentCommentId: string
  ): Promise<ModelReactionApplicationDto> {
    const response = await fetch(`/api/comments/${parentCommentId}/children/${postCommentId}/reactions`, {
      method: 'POST',
    })

    const jsonResponse = await response.json()

    if (response.ok) {
      return jsonResponse as ModelReactionApplicationDto
    }

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )
        break

      case 401:
        throw new APIException(
          'user_must_be_authenticated_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_REACTION_USER_NOT_FOUND:
            throw new APIException(
              'post_user_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND:
            throw new APIException(
              'create_post_comment_reaction_post_comment_not_found_error_message',
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

      case 409:
        throw new APIException(
          'create_post_comment_reaction_user_already_reacted_error_message',
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

  public async deletePostChildCommentReaction (
    postCommentId: string,
    parentCommentId: string
  ): Promise<void> {
    const response = await fetch(`/api/comments/${parentCommentId}/children/${postCommentId}/reactions`, {
      method: 'DELETE',
    })

    if (response.ok) {
      return
    }

    const jsonResponse = await response.json()

    switch (response.status) {
      case 400:
        throw new APIException(
          'bad_request_error_message',
          response.status,
          jsonResponse.code
        )

      case 401:
        throw new APIException(
          'user_must_be_authenticated_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case POST_COMMENT_REACTION_USER_NOT_FOUND:
            throw new APIException(
              'post_user_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_REACTION_POST_COMMENT_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_reaction_post_comment_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_COMMENT_REACTION_NOT_FOUND:
            throw new APIException(
              'delete_post_comment_reaction_user_has_not_reacted_error_messaged',
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

      default:
        throw new APIException(
          'server_error_error_message',
          response.status,
          jsonResponse.code
        )
    }
  }
}
