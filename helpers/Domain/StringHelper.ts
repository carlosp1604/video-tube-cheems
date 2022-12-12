export class StringHelper {
  private static allowedChars = /[^a-zA-Z0-9 ][-_]/g
  public static deleteNotAllowedChars(input: string): string {
    return input.replace(this.allowedChars, '')
  }
}