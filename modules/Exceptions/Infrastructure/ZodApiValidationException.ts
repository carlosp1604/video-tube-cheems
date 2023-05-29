import { ValidationErrorItem } from './ValidationErrorItem'
import { ZodIssue } from 'zod'

export class ZodApiValidationException {
  public id: string
  public exceptions: ValidationErrorItem[]

  constructor(
    id: string,
    issues: ZodIssue[]
  ) {
    this.id = id
    this.exceptions = ZodApiValidationException.parseExceptions(issues)
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