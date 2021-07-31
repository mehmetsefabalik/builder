import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { EntityType, useCrudModalForm } from '@codelab/frontend/shared'
import { Button, Space, Table, TableColumnProps } from 'antd'
import React from 'react'
import tw from 'twin.macro'
import { getTypeName } from '../../types'
import { TypeTree } from '../../typeTree/TypeTree'

export interface FieldsTableProps {
  tree: TypeTree
}

export const FieldsTable = ({ tree }: FieldsTableProps) => {
  const { openDeleteModal, openUpdateModal } = useCrudModalForm(
    EntityType.Field,
  )

  const headerCellProps = () => ({
    style: tw`font-semibold text-gray-900`,
  })

  const columns: Array<TableColumnProps<any>> = [
    {
      title: 'Field',
      dataIndex: 'name',
      key: 'name',
      onHeaderCell: headerCellProps,
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      onHeaderCell: headerCellProps,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      onHeaderCell: headerCellProps,
    },
    {
      title: 'Type',
      dataIndex: 'id',
      key: 'id',
      onHeaderCell: headerCellProps,
      render: (id) => getTypeName(tree.getFieldType(id), tree.getArrayItemType),
    },
    {
      title: 'Action',
      key: 'action',
      onHeaderCell: headerCellProps,
      width: 100,
      render: (text, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            tw="flex justify-center items-center"
            icon={<EditFilled />}
            onClick={() =>
              openUpdateModal(record.id, {
                ...record,
                typeId: tree.getFieldType(record.id)?.id,
              })
            }
          />
          <Button
            size="small"
            type="primary"
            danger
            tw="flex justify-center items-center"
            icon={<DeleteFilled />}
            onClick={() =>
              openDeleteModal([record.id], {
                ...record,
                typeId: tree.getFieldType(record.id)?.id,
              })
            }
          />
        </Space>
      ),
    },
  ]

  return (
    <Table
      pagination={{ position: ['bottomCenter'] }}
      dataSource={tree.getRootFields()}
      columns={columns}
      rowKey={(atom) => atom.id}
    />
  )
}
