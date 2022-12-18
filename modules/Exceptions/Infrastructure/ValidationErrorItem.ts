export class ValidationErrorItem {
  public message: string
  public parameter: string

  constructor(
    message: string,
    parameter: string
  ) {
    this.message = message
    this.parameter = parameter
  }
}