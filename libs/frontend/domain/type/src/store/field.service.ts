import {
  IEntityModalService,
  IFieldModalMetadata,
  IFieldModalProperties,
} from '@codelab/frontend/abstract/core'
import { ModalService } from '@codelab/frontend/shared/utils'
import { computed } from 'mobx'
import { ExtendedModel, model, modelClass } from 'mobx-keystone'

@model('@codelab/FieldModalService')
export class FieldModalService
  extends ExtendedModel(
    modelClass<ModalService<IFieldModalMetadata>>(ModalService),
    {},
  )
  implements IEntityModalService<IFieldModalMetadata, IFieldModalProperties>
{
  @computed
  get interface() {
    return this.metadata?.interface?.current
  }

  @computed
  get field() {
    return this.metadata?.field?.current
  }
}
