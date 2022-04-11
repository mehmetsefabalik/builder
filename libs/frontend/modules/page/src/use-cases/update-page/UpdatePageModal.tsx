import { createNotificationHandler } from '@codelab/frontend/shared/utils'
import { ModalForm } from '@codelab/frontend/view/components'
import { IUpdatePageDTO } from '@codelab/shared/abstract/core'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { AutoFields } from 'uniforms-antd'
import { WithPageService } from '../../store'
import { updatePageSchema } from './updatePageSchema'

export const UpdatePageModal = observer<WithPageService>(({ pageService }) => {
  const closeModal = () => pageService.updateModal.close()
  const page = pageService.updateModal.page

  if (!page) {
    return null
  }

  const onSubmit = (input: IUpdatePageDTO) => pageService.update(page, input)

  const onSubmitError = createNotificationHandler({
    title: 'Error while updating page',
  })

  const model = {
    name: page.name,
    appId: page.appId || undefined,
  }

  return (
    <ModalForm.Modal
      okText="Update Page"
      onCancel={closeModal}
      visible={pageService.updateModal.isOpen}
    >
      <ModalForm.Form<IUpdatePageDTO>
        model={model}
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        onSubmitSuccess={closeModal}
        schema={updatePageSchema}
      >
        <AutoFields omitFields={['appId']} />
      </ModalForm.Form>
    </ModalForm.Modal>
  )
})
