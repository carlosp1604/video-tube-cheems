import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'
import {
  GetPostPostChildCommentsResponseDto
} from '~/modules/Posts/Application/Dtos/GetPostPostChildCommentsResponseDto'

export class RepliesApiService {
  public async create (
    postId: string,
    comment: string,
    parentCommentId: string
  ): Promise<PostChildCommentApplicationDto> {
    return (await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        comment,
        parentCommentId,
      }),
    })).json()
  }

  public async getComments (
    parentCommentId: string,
    pageNumber: number,
    perPage: number = defaultPerPage
  ): Promise<GetPostPostChildCommentsResponseDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())

    return ((await fetch(`/api/comments/${parentCommentId}/children?${params}`)).json())
  }
}
