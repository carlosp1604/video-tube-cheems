import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import { CommentApplicationDto } from '~/modules/Posts/Application/Dtos/CommentApplicationDto'

export class CommentsApiService {
  public async create (
    postId: string,
    comment: string,
    parentCommentId: string | null
  ): Promise<CommentApplicationDto> {
    return (await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        comment,
        parentCommentId,
      }),
    })).json()
  }

  public async getComments (
    postId: string,
    pageNumber: number,
    perPage: number = defaultPerPage
  ): Promise<GetPostPostCommentsResponseDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())

    return (await fetch(`/api/posts/${postId}/comments?${params}`)).json()
  }
}
