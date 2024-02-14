import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { View } from '~/modules/Views/Domain/View'

export abstract class ViewableModel {
  private _views: Collection<View, View['id']> =
    Collection.notLoaded()

  get modelViews (): Collection<View, View['id']> {
    return this._views
  }

  set modelViews (views: Collection<View, View['id']>) {
    this._views = views
  }

  get views (): Array<View> {
    return this._views.values
  }
}
