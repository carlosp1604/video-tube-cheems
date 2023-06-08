// eslint-disable-next-line @typescript-eslint/ban-types
export class CollectionItem<T extends {}> {
  // eslint-disable-next-line no-useless-constructor
  private constructor (
    private instance: T,
    /**  Indicate if the instance should be persisted/updated in the persistence layer */
    private dirty: boolean,
    /**  Indicate if the instance should be removed from the persistence layer */
    private removed: boolean
  ) {}

  /**
   * Initialize the collection item
   * Used for relationships retrieved from the persistence layer
   * @param relatedObject Object to relate to
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static initializeRelation<T extends {}> (relatedObject: T): CollectionItem<T> {
    return new CollectionItem<T>(relatedObject, false, false)
  }

  /**
   * Create a new collection item
   * @param relatedObject Object to relate to
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static createRelation<T extends {}> (relatedObject: T): CollectionItem<T> {
    return new CollectionItem<T>(relatedObject, true, false)
  }

  /**
   * Update the item with the given instance.
   * Dirty bit is set to true
   * @param instance Instance to update with
   */
  public update (instance: T): void {
    this.instance = instance
    this.dirty = true
  }

  /**
   * Set removed flag to true
   */
  public remove (): void {
    this.removed = true
    this.dirty = true
  }

  get value (): T {
    return this.instance
  }

  public isRemoved (): boolean {
    return this.removed
  }

  public isDirty (): boolean {
    return this.dirty && !this.isRemoved()
  }
}
