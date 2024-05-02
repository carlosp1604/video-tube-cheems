import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import {
  USER_POST_NOT_FOUND,
  USER_SAVED_POSTS_CANNOT_DELETE_POST_FROM_SAVED_POSTS, USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS,
  USER_USER_NOT_FOUND
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import {
  POST_REACTION_NOT_FOUND,
  POST_REACTION_POST_NOT_FOUND, POST_REACTION_USER_NOT_FOUND
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostWithRelationsAndViewsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsAndViewsApplicationDto'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'

export class PostsApiService {
  public async getPosts (
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions,
    filters: FetchFilter<PostFilterOptions>[]
  ): Promise<GetPostsApplicationResponse> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())
    params.append('orderBy', orderBy)
    params.append('order', order)

    for (const filter of filters) {
      if (filter.value !== null) {
        params.append(filter.type, filter.value)
      }
    }

    return ((await fetch(`/api/posts?${params}`)).json())
  }

  public async getSavedPosts (
    userId: string,
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions,
    filters: FetchFilter<PostFilterOptions>[]
  ): Promise<GetPostsApplicationResponse> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())
    params.append('orderBy', orderBy)
    params.append('order', order)

    for (const filter of filters) {
      if (filter.value !== null) {
        params.append(filter.type, filter.value)
      }
    }

    return ((await fetch(`/api/users/${userId}/saved-posts?${params}`)).json())
  }

  public async getUserHistory (
    userId: string,
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions,
    filters: FetchFilter<PostFilterOptions>[]
  ): Promise<GetPostsApplicationResponse> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())
    params.append('orderBy', orderBy)
    params.append('order', order)

    for (const filter of filters) {
      if (filter.value !== null) {
        params.append(filter.type, filter.value)
      }
    }

    return ((await fetch(`/api/users/${userId}/history?${params}`)).json())
  }

  public async addPostView (postId: string): Promise<Response> {
    return fetch(`/api/posts/${postId}/post-views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public async createPostReaction (postId: string, reactionType: ReactionType): Promise<ModelReactionApplicationDto> {
    const response = await fetch(`/api/posts/${postId}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reactionType,
      }),
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
          case POST_REACTION_USER_NOT_FOUND:
            throw new APIException(
              'user_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_REACTION_POST_NOT_FOUND:
            throw new APIException(
              'post_not_found_error_message',
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
          'user_already_reacted_to_post_error_message',
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

  public async deletePostReaction (postId: string): Promise<void> {
    const response = await fetch(`/api/posts/${postId}/reactions`, {
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
          case POST_REACTION_POST_NOT_FOUND:
            throw new APIException(
              'post_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_REACTION_NOT_FOUND:
            throw new APIException(
              'post_reaction_does_not_exist_error_message',
              response.status,
              jsonResponse.code
            )

          case POST_REACTION_USER_NOT_FOUND:
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

      default:
        throw new APIException(
          'server_error_error_message',
          response.status,
          jsonResponse.code
        )
    }
  }

  public async getPostUserInteraction (postId: string): Promise<Response> {
    const fetchRoute = `/api/posts/${postId}/user-interaction`

    return fetch(fetchRoute)
  }

  public async savePost (userId: string, postId: string): Promise<PostWithRelationsAndViewsApplicationDto> {
    const fetchRoute = `/api/users/${userId}/saved-posts/${postId}`

    const response = await fetch(fetchRoute, {
      method: 'POST',
    })

    const jsonResponse = await response.json()

    if (response.ok) {
      return jsonResponse as PostWithRelationsAndViewsApplicationDto
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

      case 403:
        throw new APIException(
          'user_forbidden_resource_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case USER_USER_NOT_FOUND:
            throw new APIException(
              'user_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case USER_POST_NOT_FOUND:
            throw new APIException(
              'post_not_found_error_message',
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
          'post_save_post_already_on_saved_post_error_message',
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

  public async removeFromSavedPosts (userId: string, postId: string): Promise<void> {
    const fetchRoute = `/api/users/${userId}/saved-posts/${postId}`

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
          'user_forbidden_resource_error_message',
          response.status,
          jsonResponse.code
        )

      case 404:
        switch (jsonResponse.code) {
          case USER_USER_NOT_FOUND:
            throw new APIException(
              'user_not_found_error_message',
              response.status,
              jsonResponse.code
            )

          case USER_POST_NOT_FOUND:
            throw new APIException(
              'post_not_found_error_message',
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
        switch (jsonResponse.code) {
          case USER_SAVED_POSTS_CANNOT_DELETE_POST_FROM_SAVED_POSTS:
            throw new APIException(
              'post_save_cannot_remove_saved_post_error_message',
              response.status,
              jsonResponse.code
            )

          case USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS:
            throw new APIException(
              'post_save_post_does_not_belong_to_user_saved_posts_error_message',
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
