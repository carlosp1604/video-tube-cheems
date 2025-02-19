import { ReportRepositoryInterface } from '~/modules/Reports/Domain/ReportRepositoryInterface'
import { Report } from '~/modules/Reports/Domain/Report'
import { ReportModelTranslator } from '~/modules/Reports/Infrastructure/ReportModelTranslator'
import { prisma } from '~/persistence/prisma'

export class MysqlReportRepository implements ReportRepositoryInterface {
  /**
   * Insert a Report in the persistence layer
   * @param report Report to persist
   */
  public async save (report: Report): Promise<void> {
    const reportDatabaseModel = ReportModelTranslator.toDatabase(report)

    await prisma.report.create({
      data: {
        ...reportDatabaseModel,
      },
    })
  }
}
