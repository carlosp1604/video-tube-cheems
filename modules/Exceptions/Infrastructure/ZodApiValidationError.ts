import { ValidationErrorItem } from './ValidationErrorItem'
import { ZodIssue } from 'zod'

export class ZodApiValidationError {
  public id: string
  public exceptions: ValidationErrorItem[]

  constructor(
    id: string,
    issues: ZodIssue[]
  ) {
    this.id = id
    this.exceptions = ZodApiValidationError.parseExceptions(issues)
  }

  private static parseExceptions(issues: ZodIssue[]): ValidationErrorItem[] {
    return issues.map((issue) => {
      return new ValidationErrorItem(
        issue.message,
        issue.path[0].toString()
      )
    })
  }
}