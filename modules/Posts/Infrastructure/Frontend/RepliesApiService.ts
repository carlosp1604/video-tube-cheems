import {
  GetPostPostChildCommentsResponseDto
} from '~/modules/Posts/Application/Dtos/GetPostPostChildCommentsResponseDto'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'

export class RepliesApiService {
  public async create (
    postId: string,
    comment: string,
    parentCommentId: string
  ): Promise<Response> {
    return fetch(`/api/posts/${postId}/comments/${parentCommentId}/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    })
  }

  public async getComments (
    postId: string,
    parentCommentId: string,
    pageNumber: number,
    perPage: number = defaultPerPage
  ): Promise<GetPostPostChildCommentsResponseDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())

    return ((await fetch(`/api/posts/${postId}/comments/${parentCommentId}/children?${params}`)).json())
  }
}
