import { DateTime } from 'luxon'
import { Report as ReportPrismaModel } from '@prisma/client'
import { Report } from '~/modules/Reports/Domain/Report'

export class ReportModelTranslator {
  public static toDomain (prismaReportModel: ReportPrismaModel) {
    return new Report(
      prismaReportModel.postId,
      prismaReportModel.type,
      prismaReportModel.userId,
      prismaReportModel.content,
      DateTime.fromJSDate(prismaReportModel.createdAt),
      DateTime.fromJSDate(prismaReportModel.updatedAt)
    )
  }

  public static toDatabase (report: Report): ReportPrismaModel {
    return {
      postId: report.postId,
      type: report.type,
      userId: report.userId,
      content: report.content,
      createdAt: report.createdAt.toJSDate(),
      updatedAt: report.updatedAt.toJSDate(),
    }
  }
}
