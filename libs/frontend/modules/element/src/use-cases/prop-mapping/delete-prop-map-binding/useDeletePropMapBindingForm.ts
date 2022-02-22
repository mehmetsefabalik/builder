import { CRUDActionType } from '@codelab/frontend/abstract/core'
import { UseEntityUseCaseForm } from '@codelab/frontend/abstract/types'
import { createNotificationHandler } from '@codelab/frontend/shared/utils'
import { EmptyJsonSchemaType } from '@codelab/frontend/view/components'
import { assertIsDefined } from '@codelab/shared/utils'
import { useCallback } from 'react'
import { PropMapBindingFragment } from '../../../graphql/Element.fragment.graphql.gen'
import {
  usePropMapBindingDispatch,
  usePropMapBindingState,
} from '../../../hooks'
import { useDeletePropMapBindingsMutation } from '../../../store'

export const useDeletePropMapBindingForm: UseEntityUseCaseForm<
  EmptyJsonSchemaType,
  CRUDActionType,
  PropMapBindingFragment,
  unknown,
  string
> = (elementId) => {
  const { deleteIds, entity, actionType } = usePropMapBindingState()
  const { resetModal } = usePropMapBindingDispatch()

  assertIsDefined(elementId)

  const [mutate, { isLoading }] = useDeletePropMapBindingsMutation({
    selectFromResult: (r) => ({
      hook: r.data?.deletePropMapBindings,
      isLoading: r.isLoading,
      error: r.error,
    }),
  })

  const handleSubmit = useCallback(() => {
    return mutate({ variables: { where: { id_IN: deleteIds } } }).unwrap()
  }, [mutate, deleteIds])

  return {
    onSubmit: handleSubmit,
    onSubmitError: [
      createNotificationHandler({
        title: 'Error while deleting prop map binding',
      }),
    ],
    model: {},
    onSubmitSuccess: [() => resetModal()],
    isLoading,
    entity,
    reset: resetModal,
    actionType,
  }
}
