export class APIException {
  public readonly translationKey: string
  public readonly apiCode: number
  public readonly code: string

  constructor (translationKey: string, apiCode: number, code: string) {
    this.translationKey = translationKey
    this.apiCode = apiCode
    this.code = code

    Object.setPrototypeOf(this, APIException.prototype)
  }
}
