import { ITagService } from '@codelab/frontend/abstract/core'
import { CheckedKeys } from '@codelab/frontend/abstract/types'
import { Spinner } from '@codelab/frontend/view/components'
import { Tree, TreeProps } from 'antd'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAsync } from 'react-use'
import { tagRef } from '../../store'

export const GetTagsTree = observer<{ tagService: ITagService }>(
  ({ tagService }) => {
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
      tagService.setSelectedTag(tagRef(selectedKeys[0].toString()))
    }

    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
      const { checked } = checkedKeys as CheckedKeys

      tagService.setCheckedTags(
        checked.map((check) => tagRef(check.toString())),
      )
    }

    const { loading } = useAsync(() => tagService.getAll(), [])

    return (
      <Spinner isLoading={loading}>
        <Tree
          checkStrictly
          checkable
          checkedKeys={tagService.checkedTags.map(
            (checkedTag) => checkedTag.id,
          )}
          disabled={loading}
          onCheck={onCheck}
          onSelect={onSelect}
          treeData={tagService.treeService.antdTreeData}
        />
      </Spinner>
    )
  },
)
