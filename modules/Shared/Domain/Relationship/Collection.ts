import { CollectionItem } from '~/modules/Shared/Domain/Relationship/CollectionItem'
import { RelationshipDomainException } from '~/modules/Shared/Domain/Relationship/RelationshipDomainException'

// eslint-disable-next-line @typescript-eslint/ban-types
export class Collection<T extends {}, V extends {}> {
  private readonly instances: Map<V, CollectionItem<T>> | undefined

  private constructor (instances: Map<V, CollectionItem<T>> | undefined) {
    this.instances = instances
  }

  /**
   * Create an empty collection
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static initializeCollection<T extends {}, V extends {}> (): Collection<T, V> {
    return new Collection<T, V>(new Map<V, CollectionItem<T>>())
  }

  /**
   * Create a not loaded collection
   * The items weren't retrieved from persistence layer
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static notLoaded<T extends {}, V extends {}> (): Collection<T, V> {
    return new Collection<T, V>(undefined)
  }

  /**
   * Add a new item to the collection. If item already exists, is updated.
   * @param relatedObject Object to relate with
   * @param objectIdentifier Object identifier
   */
  public addItem (
    relatedObject: T,
    objectIdentifier: V
  ): void {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    this.instances.set(objectIdentifier, CollectionItem.initializeRelation(relatedObject))
  }

  /**
   * Remove a collection item given its identifier
   * @param objectIdentifier Object identifier
   * @return true if removed or false
   */
  public removeItem (objectIdentifier: V): boolean {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    const itemToDelete = this.instances.get(objectIdentifier)

    if (itemToDelete) {
      itemToDelete.remove()
      this.instances.set(objectIdentifier, itemToDelete)

      return true
    }

    return false
  }

  /**
   * Find an not removed item given its identifier
   * @param objectIdentifier Object identifier
   * @return Item if found or null
   */
  public getItem (objectIdentifier: V): T | null {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    const item = this.instances.get(objectIdentifier)

    if (!item || item.isRemoved()) {
      return null
    }

    return item.value
  }

  get dirtyValues (): Array<T> {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }
    const values : Array<T> = []

    this.instances.forEach((value) => {
      if (value.isDirty() && !value.isRemoved()) {
        values.push(value.value)
      }
    })

    return values
  }

  get removedValues (): Array<T> {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }
    const values : Array<T> = []

    this.instances.forEach((value) => {
      if (value.isRemoved()) {
        values.push(value.value)
      }
    })

    return values
  }

  get values (): Array<T> {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }
    const values : Array<T> = []

    this.instances.forEach((value) => {
      if (!value.isRemoved()) {
        values.push(value.value)
      }
    })

    return values
  }
}
