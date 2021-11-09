import { createNotificationHandler } from '@codelab/frontend/shared/utils'
import {
  emptyJsonSchema,
  EmptyJsonSchemaType,
  EntityType,
  FormUniforms,
  UniFormUseCaseProps,
  useCrudModalMutationForm,
} from '@codelab/frontend/view/components'
import React, { useContext } from 'react'
import { AutoFields } from 'uniforms-antd'
import { InterfaceContext } from '../../types'
import { useDeleteFieldMutation } from '../fieldEndpoints'

type DeleteFieldFormProps = UniFormUseCaseProps<EmptyJsonSchemaType>

export const DeleteFieldForm = (props: DeleteFieldFormProps) => {
  const {
    interface: { id: interfaceId },
  } = useContext(InterfaceContext)

  const {
    handleSubmit,
    crudModal: {
      reset,
      state: { metadata },
    },
  } = useCrudModalMutationForm({
    entityType: EntityType.Field,
    useMutationFunction: useDeleteFieldMutation,
    mapVariables: (_, crudModalState) => ({
      input: { fieldId: crudModalState.deleteIds[0] },
    }),
  })

  return (
    <FormUniforms<EmptyJsonSchemaType>
      onSubmit={handleSubmit}
      schema={emptyJsonSchema}
      onSubmitError={createNotificationHandler({
        title: 'Error while deleting Field',
      })}
      onSubmitSuccess={() => reset()}
      {...props}
    >
      <h4>Are you sure you want to delete field "{metadata?.name}"?</h4>
      <AutoFields />
    </FormUniforms>
  )
}
