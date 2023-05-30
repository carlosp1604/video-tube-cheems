import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import { ChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/ChildCommentApplicationDto'
import {
  GetPostPostChildCommentsRespondeDto
} from '~/modules/Posts/Application/Dtos/GetPostPostChildCommentsResponseDto'

export class RepliesApiService {
  public async create (
    postId: string,
    comment: string,
    parentCommentId: string
  ): Promise<ChildCommentApplicationDto> {
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
    parentCommentId: string,
    pageNumber: number,
    perPage: number = defaultPerPage
  ): Promise<GetPostPostChildCommentsRespondeDto> {
    const params = new URLSearchParams()

    params.append('page', pageNumber.toString())
    params.append('perPage', perPage.toString())
    params.append('parentCommentId', parentCommentId)

    return ((await fetch(`/api/posts/${postId}/comments?${params}`)).json())
  }
}
