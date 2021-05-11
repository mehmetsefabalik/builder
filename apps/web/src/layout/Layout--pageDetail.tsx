import { EditorProvider } from '@codelab/frontend/builder'
import { AppPageProvider } from '@codelab/frontend/shared'
import { useRouter } from 'next/router'
import React from 'react'
import { NextPageLayout } from './Layout.d'
import { LayoutBuilder } from './Layout--builder'

export const LayoutPageDetail = (props: NextPageLayout<'builder'>) => {
  const { children, MainPane } = props
  const { query } = useRouter()
  const appId = `${query.appId}`
  const pageId = `${query.pageId}`

  if (!appId) {
    throw new Error('Missing "appId"')
  }

  if (!pageId) {
    throw new Error('Missing "pageId"')
  }

  return (
    <AppPageProvider appId={appId} pageId={pageId}>
      <EditorProvider>
        <LayoutBuilder MainPane={MainPane}>{children}</LayoutBuilder>
      </EditorProvider>
    </AppPageProvider>
  )
}
