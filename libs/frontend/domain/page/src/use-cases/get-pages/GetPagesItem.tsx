import { FileOutlined } from '@ant-design/icons'
import {
  IPage,
  IPageService,
  PROVIDER_TREE_PAGE_NAME,
} from '@codelab/frontend/abstract/core'
import { PageType } from '@codelab/frontend/abstract/types'
import {
  ListItemDeleteButton,
  ListItemEditButton,
} from '@codelab/frontend/view/components'
import { List, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { pageRef } from '../../store'

export interface GetPagesItemProps {
  page: IPage
  pageService: IPageService
}

export const GetPagesItem = observer<GetPagesItemProps>(
  ({ page, pageService }) => {
    const router = useRouter()
    const isProviderTreePage = page.name === PROVIDER_TREE_PAGE_NAME

    const href = isProviderTreePage
      ? { pathname: PageType.AppProviderDetail, query: router.query }
      : {
          pathname: PageType.PageBuilder,
          query: { ...router.query, pageId: page.id },
        }

    const onClickDelete = () => pageService.deleteModal.open(pageRef(page.id))
    const onClickEdit = () => pageService.updateModal.open(pageRef(page.id))

    return (
      <List.Item style={{ paddingLeft: 0 }}>
        <Space style={{ width: '100%' }}>
          <FileOutlined />
          <Link href={href}>
            <a>{page.name}</a>
          </Link>
        </Space>
        {!isProviderTreePage && (
          <Space>
            <ListItemEditButton onClick={onClickEdit} />
            <ListItemDeleteButton onClick={onClickDelete} />
          </Space>
        )}
      </List.Item>
    )
  },
)
