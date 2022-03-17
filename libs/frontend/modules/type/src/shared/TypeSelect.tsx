import { observer } from 'mobx-react-lite'
import React from 'react'
import { SelectField } from 'uniforms-antd'
import { useGetAllTypesQuery } from '../hooks'
import { TypeStore } from '../store'

export type CreateTypeSelectOptions = (
  getTypesResult?: ReturnType<typeof useGetAllTypesQuery>,
) => Array<{ label: string; value: string }>

export type TypeSelectProps = {
  name: string
  label: string
  typeStore: TypeStore
  createTypeOptions?: CreateTypeSelectOptions
}

const defaultCreateTypeOptions: CreateTypeSelectOptions = (getTypesResult) =>
  getTypesResult?.data?.map((i: any) => ({
    label: i.name,
    value: i.id,
  })) || []

export const TypeSelect = observer(
  ({ name, label, createTypeOptions, typeStore }: TypeSelectProps) => {
    const types = useGetAllTypesQuery(undefined, typeStore)

    const typeOptions = createTypeOptions
      ? createTypeOptions(types)
      : defaultCreateTypeOptions(types)

    return (
      <SelectField
        label={label}
        loading={types.isLoading}
        name={name}
        optionFilterProp="label"
        options={typeOptions}
        showSearch={true}
      />
    )
  },
)
