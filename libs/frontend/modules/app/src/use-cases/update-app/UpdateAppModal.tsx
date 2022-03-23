import { createNotificationHandler } from '@codelab/frontend/shared/utils'
import { ModalForm } from '@codelab/frontend/view/components'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { AutoFields } from 'uniforms-antd'
import { AppService, WithAppService } from '../../store'
import { UpdateAppInput, updateAppSchema } from './updateAppSchema'

export const UpdateAppModal = observer<WithAppService>(({ appService }) => {
  const app = appService.selectedRef

  const onSubmit = (input: UpdateAppInput) => {
    if (!app) {
      throw new Error('Updated app is not set')
    }

    return appService.update(app.id, input)
  }

  const onSubmitError = createNotificationHandler({
    title: 'Error while updating app',
  })

  const closeModal = () => appService.updateModal.close()

  return (
    <ModalForm.Modal
      okText="Update App"
      onCancel={closeModal}
      visible={appService.updateModal.isOpen}
    >
      <ModalForm.Form
        model={{
          name: app?.current.name,
        }}
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        onSubmitSuccess={closeModal}
        schema={updateAppSchema}
      >
        <AutoFields />
      </ModalForm.Form>
    </ModalForm.Modal>
  )
})
