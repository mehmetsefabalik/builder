import { useUser } from '@auth0/nextjs-auth0'
import { createNotificationHandler } from '@codelab/frontend/shared/utils'
import { ModalForm } from '@codelab/frontend/view/components'
import { TypeKind } from '@codelab/shared/abstract/core'
import { observer } from 'mobx-react-lite'
import React from 'react'
import tw from 'twin.macro'
import { AutoField, AutoFields } from 'uniforms-antd'
import {
  createNonUnionTypeOptionsForTypeSelect,
  TypeSelect,
} from '../../../shared'
import { TypeStore } from '../../../store'
import {
  CreateTypeSchema,
  createTypeSchema,
  mapCreateTypeSchemaToTypeInput,
} from './createTypeSchema'
import { DisplayIfKind } from './DisplayIfKind'

export interface CreateTypeModalProps {
  typeStore: TypeStore
}

export const CreateTypeModal = observer<CreateTypeModalProps>(
  ({ typeStore }) => {
    const closeModal = () => typeStore.createModal.close()
    const user = useUser()

    return (
      <ModalForm.Modal
        className="create-type-modal"
        okText="Create"
        onCancel={closeModal}
        title={<span css={tw`font-semibold`}>Create type</span>}
        visible={typeStore.createModal.isOpen}
      >
        <ModalForm.Form<CreateTypeSchema>
          model={{}}
          onSubmit={(data) => {
            const input = mapCreateTypeSchemaToTypeInput(
              data,
              user.user?.sub,
            ) as any

            return typeStore.create(data.kind, input)
          }}
          onSubmitError={createNotificationHandler({
            title: 'Error while creating type',
            type: 'error',
          })}
          onSubmitSuccess={closeModal}
          schema={createTypeSchema}
        >
          <AutoFields fields={['name', 'kind']} />
          <DisplayIfKind kind={TypeKind.PrimitiveType}>
            <AutoField name="primitiveKind" />
          </DisplayIfKind>
          <DisplayIfKind kind={TypeKind.UnionType}>
            <AutoField
              createTypeOptions={createNonUnionTypeOptionsForTypeSelect}
              name="typeIdsOfUnionType"
              typeStore={typeStore}
            />
          </DisplayIfKind>
          {/* <ListField name="unionTypes" />; */}
          <DisplayIfKind kind={TypeKind.EnumType}>
            <AutoField name="allowedValues" />
          </DisplayIfKind>
          <DisplayIfKind kind={TypeKind.ArrayType}>
            <TypeSelect
              label="Array item type"
              name="arrayItemTypeId"
              typeStore={typeStore}
            />
          </DisplayIfKind>
          <DisplayIfKind kind={TypeKind.ElementType}>
            <AutoField label="Element kind" name="elementKind" />
          </DisplayIfKind>
          <DisplayIfKind kind={TypeKind.MonacoType}>
            <AutoField label="Language" name="language" />
          </DisplayIfKind>
        </ModalForm.Form>
      </ModalForm.Modal>
    )
  },
)
