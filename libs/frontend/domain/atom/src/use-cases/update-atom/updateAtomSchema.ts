import {
  filterNotHookType,
  IUpdateAtomDTO,
} from '@codelab/frontend/abstract/core'
import { IAtomType } from '@codelab/shared/abstract/core'
import { JSONSchemaType } from 'ajv'

export const updateAtomSchema: JSONSchemaType<IUpdateAtomDTO> = {
  title: 'Update Atom Input',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      nullable: true,
      uniforms: {
        component: () => null,
      },
    },
    name: {
      type: 'string',
      autoFocus: true,
    },
    // Hide field for now, added only to implement the interface
    api: {
      type: 'string',
      nullable: true,
      uniforms: {
        component: () => null,
      },
    },
    type: {
      type: 'string',
      enum: Object.values(IAtomType).filter(filterNotHookType),
      showSearch: true,
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      nullable: true,
      showSearch: true,
    },
    allowedChildren: {
      type: 'array',
      items: {
        type: 'string',
      },
      nullable: true,
      showSearch: true,
    },
  },
  required: ['name', 'type'],
} as const
