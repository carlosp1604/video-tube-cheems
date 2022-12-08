import { randomUUID } from 'crypto'

export class UuidGenerator {
  public static get(): string {
    return randomUUID()
  }
}