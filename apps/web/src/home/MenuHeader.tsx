import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useUser } from '@auth0/nextjs-auth0'
import { PageType } from '@codelab/frontend/abstract/types'
import {
  LoginUserButton,
  RegisterUserButton,
  SignOutUserButton,
} from '@codelab/frontend/modules/user'
import { useMobileOrTabletMediaQuery } from '@codelab/frontend/shared/style'
import {
  disableMenuHoverEffects,
  removeHoverBorder,
} from '@codelab/frontend/view/style'
import { Button, Menu } from 'antd'
import Link from 'next/link'
import React, { useState } from 'react'
import tw from 'twin.macro'

/**
 * We always show `Login` `Register` even if user is login. We simply redirect them to `/apps` page if they're already logged in.
 */
export const HomeMenuHeader = () => {
  const { user } = useUser()
  const [collapsed, setCollapsed] = useState(true)
  const isMobileOrTablet = useMobileOrTabletMediaQuery()

  const authenticatedUserMenu = (
    <>
      <Menu.Item
        icon={<SignOutUserButton />}
        key="3"
        style={{ order: 6, ...disableMenuHoverEffects }}
      />
      <Menu.SubMenu
        icon={<UserOutlined />}
        key="4"
        popupClassName="h-auto"
        style={{ order: 5 }}
      >
        <Menu.Item>Email {user?.email}</Menu.Item>
      </Menu.SubMenu>
    </>
  )

  const guestUserMenu = (
    <>
      <Menu.Item
        css={[removeHoverBorder]}
        icon={<RegisterUserButton />}
        key="3"
        style={{
          order: 6,
          ...disableMenuHoverEffects,
        }}
      />
      <Menu.Item
        css={[removeHoverBorder]}
        icon={<LoginUserButton />}
        key="4"
        style={{
          order: 5,
          ...disableMenuHoverEffects,
        }}
      />
    </>
  )

  return (
    <div style={{ width: collapsed ? 0 : '100%' }}>
      <Button
        onClick={() => setCollapsed(!collapsed)}
        style={{ marginBottom: 16 }}
        type="primary"
      >
        <>{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</>
      </Button>
      <Menu
        css={tw`justify-end flex-grow`}
        inlineCollapsed={collapsed}
        mode={isMobileOrTablet ? 'inline' : 'horizontal'}
        style={
          isMobileOrTablet
            ? {
                width: '100%',
              }
            : {}
        }
        triggerSubMenuAction="click"
      >
        <Menu.Item key="features">
          <Link href={PageType.Features}>
            <a>Features</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="docs">
          <Link href={PageType.Docs}>
            <a>Docs</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="pricing">
          <Link href={PageType.Pricing}>
            <a>Pricing</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="tutorials">
          <Link href={PageType.Tutorials}>
            <a>Tutorials</a>
          </Link>
        </Menu.Item>
        {user ? authenticatedUserMenu : guestUserMenu}
      </Menu>
      {/* </section> */}
    </div>
  )
}
