import { notify } from '@codelab/frontend/shared/utils'
import { Button } from 'antd'
import fileDownload from 'js-file-download'
import React from 'react'
import { useLazyExportAtomsQuery } from '../../store'
import { ExportAtomsButtonProps } from './types'

export const ExportAtomsButton = ({ atomIds }: ExportAtomsButtonProps) => {
  const [getExportAtoms, { isLoading, data, error }] = useLazyExportAtomsQuery()

  const onClick = async () => {
    await getExportAtoms({
      variables: {
        input: {
          where: {
            ids: atomIds,
          },
        },
      },
    })

    if (data) {
      const content = JSON.stringify(data.getAtoms)
      fileDownload(content, 'atoms.json')
    }

    if (error) {
      notify({ title: 'Error while exporting atoms', type: 'error' })
    }
  }

  return (
    <Button loading={isLoading} onClick={onClick}>
      Export
    </Button>
  )
}
