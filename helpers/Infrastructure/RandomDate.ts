export class RandomDate {
  private static defaultStart = new Date(2012, 0, 1)
  private static defaultEnd = new Date()
  
  public static get(start: Date = this.defaultStart, end: Date = this.defaultEnd): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

  }
}