export interface Provider<T> {
  provide: string
  useValue?: T,
  useClass?: () => T
  useFactory?: () => T
}