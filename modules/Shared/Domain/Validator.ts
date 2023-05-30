export abstract class Validator<T> {
  public abstract validate (value: T): T
}
