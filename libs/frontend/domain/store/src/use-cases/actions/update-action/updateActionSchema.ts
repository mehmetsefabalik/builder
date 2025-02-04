import { IUpdateActionDTO } from '@codelab/frontend/abstract/core'
import { JSONSchemaType } from 'ajv'
import { createActionSchema } from '../create-action'

export const updateActionSchema: JSONSchemaType<IUpdateActionDTO> = {
  ...createActionSchema,
  title: 'Update action',
} as const
