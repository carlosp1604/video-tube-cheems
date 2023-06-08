import { RelationshipDomainException } from '~/modules/Shared/Domain/Relationship/RelationshipDomainException'

export class Relationship<T> {
  private instance: T | undefined
  private readonly loaded: boolean
  private removed = false
  private dirty = false

  private constructor (instance: T | undefined, loaded: boolean, dirty: boolean) {
    this.instance = instance
    this.loaded = loaded
    this.dirty = dirty
  }

  /**
   * Initialize the relationship
   * Used for relationships retrieved from the persistence layer
   * @param relatedObject Object to relate to
   */
  public static initializeRelation<T> (relatedObject: T): Relationship<T> {
    return new Relationship<T>(relatedObject, true, false)
  }

  /**
   * Create a new relationship
   * @param relatedObject Object to relate to
   */
  public static createRelation<T> (relatedObject: T): Relationship<T> {
    return new Relationship<T>(relatedObject, true, true)
  }

  /**
   * Create a not loaded relationship.
   * The instance wasn't retrieved from persistence layer
   */
  public static notLoaded<T> (): Relationship<T> {
    return new Relationship<T>(undefined, false, false)
  }

  /**
   * Delete current relationship.
   * Current relationship can be removed once
   * @return true if relationship was removed or false
   */
  public removeRelationship (): boolean {
    if (!this.loaded) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    if (this.isRemoved) {
      return false
    }

    this.removed = true
    this.instance = undefined
    this.dirty = false

    return true
  }

  /**
   * Add a new relationship.
   * Current relationship will be removed if is needed
   * @param relatedObject Object to relate to
   * @return true if relationship was updated or false
   */
  public updateRelationship (relatedObject: T): boolean {
    if (!this.loaded) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    if (!this.isRemoved) {
      return this.removeRelationship()
    }

    this.instance = relatedObject
    this.dirty = true

    return true
  }

  get value (): T | undefined {
    if (!this.loaded) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    return this.instance
  }

  get isDirty (): boolean {
    return this.dirty
  }

  get isRemoved (): boolean {
    return this.removed
  }
}
