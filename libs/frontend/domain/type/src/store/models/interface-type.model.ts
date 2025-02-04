import type {
  IField,
  IFieldProps,
  IInterfaceType,
  IInterfaceTypeDTO,
  IPropData,
  ITypeDTO,
} from '@codelab/frontend/abstract/core'
import { assertIsTypeKind, ITypeKind } from '@codelab/shared/abstract/core'
import { computed } from 'mobx'
import {
  ExtendedModel,
  model,
  modelAction,
  objectMap,
  prop,
} from 'mobx-keystone'
import { updateBaseTypeCache } from '../base-type'
import { createBaseType } from './base-type.model'
import { Field } from './field.model'

const hydrate = ({
  id,
  kind,
  name,
  fieldsConnection,
  ownerConnection,
  owner,
}: IInterfaceTypeDTO): InterfaceType => {
  assertIsTypeKind(kind, ITypeKind.InterfaceType)

  console.log(fieldsConnection)

  const interfaceType = new InterfaceType({
    id,
    kind,
    name,
    ownerId: owner.id,
    ownerAuthId: owner.auth0Id,
    defaults: JSON.parse(ownerConnection.edges[0]?.data || '{}'),
  })

  for (const edge of fieldsConnection.edges) {
    interfaceType.updateFieldCache(edge)
  }

  return interfaceType
}

@model('@codelab/InterfaceType')
export class InterfaceType
  extends ExtendedModel(createBaseType(ITypeKind.InterfaceType), {
    fields: prop(() => objectMap<IField>()),
    ownerAuthId: prop<string>(),
    defaults: prop<IPropData>(),
  })
  implements IInterfaceType
{
  @computed
  get fieldList() {
    return [...this.fields.values()]
  }

  field(id: string) {
    return this.fields.get(id)
  }

  @modelAction
  updateFieldCache(fragment: IFieldProps): Field {
    const field = Field.hydrate(fragment)

    this.fields.set(field.id, field)

    return field
  }

  @modelAction
  deleteFieldLocal(field: IField) {
    this.fields.delete(field.id)
  }

  @modelAction
  writeCache(fragment: ITypeDTO) {
    updateBaseTypeCache(this, fragment)

    if (fragment.__typename !== ITypeKind.InterfaceType) {
      throw new Error('Invalid InterfaceType')
    }

    for (const fieldEdge of fragment.fieldsConnection.edges) {
      let field = this.field(fieldEdge.id)

      if (field) {
        field.writeCache(fieldEdge)
      } else {
        field = this.updateFieldCache(fieldEdge)
        this.fields.set(field.id, field)
      }
    }

    this.defaults = JSON.parse(fragment.ownerConnection.edges[0]?.data || '{}')
    // const newFieldsKeySet = new Set(this.fields.map((f) => f.key))
    //
    // for (const [key, field] of this.fields) {
    //   if (!newFieldsKeySet.has(key)) {
    //     this.fields.delete(field.id)
    //   }
    // }

    return this
  }

  public static hydrate = hydrate
}
