import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { CreateReportApplicationRequestDto } from '~/modules/Reports/Application/CreateReportApplicationRequestDto'
import { ReportRepositoryInterface } from '~/modules/Reports/Domain/ReportRepositoryInterface'
import { CreateReportApplicationException } from '~/modules/Reports/Application/CreateReportApplicationException'
import { Post } from '~/modules/Posts/Domain/Post'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'

export class CreateReport {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    readonly postRepository: PostRepositoryInterface,
    readonly reportRepository: ReportRepositoryInterface,
    readonly userRepository: UserRepositoryInterface
  ) {}

  public async create (request: CreateReportApplicationRequestDto): Promise<void> {
    const post = await this.postRepository.findById(request.postId, ['reports'])

    if (post === null) {
      throw CreateReportApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw CreateReportApplicationException.postNotFound(request.postId)
    }

    const report = (post as Post)
      .addReport(user.id, 'report', request.content)

    if (!report) {
      throw CreateReportApplicationException.userAlreadyReportedPost(request.postId, user.id)
    }

    await this.reportRepository.save(report)
  }
}
