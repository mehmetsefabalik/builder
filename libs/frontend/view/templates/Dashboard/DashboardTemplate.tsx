import { BuilderDashboardTemplateProps } from '@codelab/frontend/abstract/types'
import { css } from '@emotion/react'
import { Layout } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import tw from 'twin.macro'
import { useResizable } from '../../components'
import { defaultHeaderHeight, sidebarNavigationWidth } from './constants'
import DashboardTemplateMainPane from './DashboardTemplateMainPane'
import { DashboardTemplateMetaPane } from './DashboardTemplateMetaPane'

const { Sider, Header: AntDesignHeader } = Layout

export const DashboardTemplate = ({
  children,
  Header,
  MetaPane,
  SidebarNavigation,
  MainPane,
  headerHeight,
  contentStyles,
}: React.PropsWithChildren<BuilderDashboardTemplateProps>) => {
  const mainPaneResizable = useResizable({
    width: { default: 300, max: 600, min: 300 },
  })

  const metaPaneResizable = useResizable({
    height: { default: 320, max: 400, min: 5 },
  })

  return (
    <Layout
      css={css`
        min-height: 100% !important;
      `}
    >
      {SidebarNavigation && (
        <Sider
          collapsed
          collapsedWidth={40}
          style={{
            zIndex: 50,
            maxHeight: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
          }}
          theme="light"
        >
          <div css={tw`h-full`}>
            <SidebarNavigation />
          </div>
        </Sider>
      )}

      <Layout>
        {Header && (
          <AntDesignHeader
            style={{
              zIndex: 50,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              width: `calc(100% - ${
                SidebarNavigation ? sidebarNavigationWidth : 0
              }px)`,
              height: headerHeight ?? defaultHeaderHeight,
              marginLeft: SidebarNavigation ? sidebarNavigationWidth : 0,
            }}
          >
            <Header />
          </AntDesignHeader>
        )}

        <Layout style={contentStyles}>
          {MainPane && (
            <DashboardTemplateMainPane
              MainPane={MainPane}
              hasHeader={!!Header}
              hasSidebarNavigation={!!SidebarNavigation}
              headerHeight={headerHeight ?? defaultHeaderHeight}
              resizable={mainPaneResizable}
            />
          )}

          <motion.main
            css={tw`relative p-2 flex-auto`}
            style={{
              marginTop: Header ? headerHeight ?? defaultHeaderHeight : 0,
              marginLeft: MainPane ? mainPaneResizable.width : undefined,
            }}
          >
            <div
              style={{
                marginLeft: SidebarNavigation ? sidebarNavigationWidth : 0,
              }}
            >
              {children}
            </div>
          </motion.main>

          <AnimatePresence initial={false}>
            {MetaPane && (
              <DashboardTemplateMetaPane
                MetaPane={MetaPane}
                hasMainPane={!!MainPane}
                hasSidebarNavigation={!!SidebarNavigation}
                mainPaneWidth={mainPaneResizable.width}
                resizable={metaPaneResizable}
              />
            )}
          </AnimatePresence>
        </Layout>
      </Layout>
    </Layout>
  )
}
