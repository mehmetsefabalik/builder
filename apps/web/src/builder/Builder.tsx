import { Layout } from 'antd'
import { useRouter } from 'next/router'
import React, { PropsWithChildren } from 'react'
import { useRecoilState } from 'recoil'
import { pageState } from '../useCases/pages/usePage'
import { useBuilderLayout } from './builderPanelState'
import { BuilderDetails } from './details/Builder-details'
import { BuilderDrawer } from './drawer/Builder-drawer'
import { BuilderNavigation } from './navigation/Builder-navigation'
import { BuilderMenuSidebar } from './sidebar/Builder-menu--sidebar'
import { PropsWithIds, RouterGuard, contentStyle } from '@codelab/frontend'

const { Sider, Content } = Layout

export const Builder = ({
  children,
}: PropsWithChildren<PropsWithIds<'appId'>>) => {
  const [pageDetails, setPageDetails] = useRecoilState(pageState)
  const layout = useBuilderLayout()

  const { pageId } = pageDetails
  const { query } = useRouter()
  const appId = `${query.appId}`

  return (
    <Layout style={{ height: '100%' }}>
      <BuilderDrawer />
      <Sider theme="light" collapsed collapsedWidth={40}>
        <BuilderMenuSidebar />
      </Sider>
      {layout.navigation.visible ? (
        <Sider theme="light" width={200}>
          <RouterGuard guards={['appId']}>
            <BuilderNavigation />
          </RouterGuard>
          {/* <DashboardTreeContainer>
              {({ data }: DashboardTreeProps) => <DashboardTree data={data} />}
            </DashboardTreeContainer> */}
        </Sider>
      ) : null}
      {layout.details.visible ? (
        <Sider theme="light" width={320}>
          <BuilderDetails appId={appId} />
        </Sider>
      ) : null}
      <Layout>
        <Content style={contentStyle}>{children}</Content>
      </Layout>
    </Layout>
  )
}
