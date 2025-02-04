import { IActionBase, IActionDTO } from '@codelab/frontend/abstract/core'
import { IActionKind } from '@codelab/shared/abstract/core'
import { idProp, Model, prop } from 'mobx-keystone'

export const createBaseAction = <T extends IActionKind>(type: T) =>
  class
    extends Model({
      id: idProp,
      name: prop<string>(),
      type: prop<T>(() => type),
      storeId: prop<string>(),
    })
    implements Omit<IActionBase, 'createRunner'> {}

export const updateBaseAction = (self: IActionBase, data: IActionDTO) => {
  self.name = data.name
  self.storeId = data.store.id
  self.type = data.type

  return self
}
