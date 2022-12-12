import { randomUUID } from 'crypto'

export class UuidGenerator {
  public get(): string {
    return randomUUID()
  }
}