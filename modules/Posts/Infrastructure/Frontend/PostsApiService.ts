import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDto'
import { Reaction } from '~/modules/Posts/Domain/PostReaction'

export class PostsApiService {
  public async getPosts (
    pageNumber: number,
    perPage: number = defaultPerPage,
    order: InfrastructureSortingCriteria,
    orderBy: InfrastructureSortingOptions,
    filters: FetchPostsFilter[]
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

    return ((await fetch(`${'/api/posts'}?${params}`)).json())
  }

  public async addPostView (postId: string): Promise<Response> {
    return fetch(`/api/posts/${postId}/post-views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // FIXME: ReactionType
  // TODO: Support more reaction types
  public async createPostReaction (postId: string, reactionType: Reaction): Promise<Response> {
    return fetch(`/api/posts/${postId}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reactionType,
      }),
    })
  }

  public async deletePostReaction (postId: string): Promise<Response> {
    return fetch(`/api/posts/${postId}/reactions`, {
      method: 'DELETE',
    })
  }

  public async deletePostComment (
    postId: string,
    postCommentId: string,
    parentCommentId: string | null
  ): Promise<Response> {
    let fetchRoute = `/api/posts/${postId}/comments/${postCommentId}`

    if (parentCommentId !== null) {
      fetchRoute = `/api/posts/${postId}/comments/${parentCommentId}/children/${postCommentId}`
    }

    return fetch(fetchRoute, {
      method: 'DELETE',
    })
  }
}
