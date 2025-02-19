import { Report } from '~/modules/Reports/Domain/Report'

export interface ReportRepositoryInterface {
  /**
   * Insert a Report in the persistence layer
   * @param report Report to persist
   */
  save(report: Report): Promise<void>
}
