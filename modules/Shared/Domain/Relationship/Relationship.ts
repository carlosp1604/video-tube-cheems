import { RelationshipDomainException } from '~/modules/Shared/Domain/Relationship/RelationshipDomainException'

export class Relationship<T> {
  private instance: T | undefined | null

  private constructor (instance: T | undefined) {
    this.instance = instance
  }

  /**
   * Initialize the relationship
   * Used for relationships retrieved from the persistence layer
   * @param relatedObject Object to relate to
   */
  public static initializeRelation<T> (relatedObject: T): Relationship<T> {
    return new Relationship<T>(relatedObject)
  }

  /**
   * Create a new relationship
   * @param relatedObject Object to relate to
   */
  public static createRelation<T> (relatedObject: T): Relationship<T> {
    return new Relationship<T>(relatedObject)
  }

  /**
   * Create a not loaded relationship.
   * The instance wasn't retrieved from persistence layer
   */
  public static notLoaded<T> (): Relationship<T> {
    return new Relationship<T>(undefined)
  }

  /**
   * Delete current relationship.
   * Current relationship can be removed once
   */
  public removeRelationship (): void {
    if (this.instance === undefined) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    // Relation does not exist or was already removed
    if (this.instance === null) {
      throw RelationshipDomainException.cannotDeleteRelation()
    }

    this.instance = null
  }

  /**
   * Update a relationship.
   * Current relationship will be removed if is needed
   * @param relatedObject Object to relate to
   */
  public updateRelationship (relatedObject: T): void {
    if (this.instance === undefined) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    this.instance = relatedObject
  }

  get value (): T | null {
    if (this.instance === undefined) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    return this.instance
  }
}
