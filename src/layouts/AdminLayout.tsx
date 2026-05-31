import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Breadcrumb } from 'antd'
import {
  DashboardOutlined,
  AppleOutlined,
  ShopOutlined,
  HomeOutlined,
  LogoutOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/auth'

const { Header, Sider, Content } = Layout

const breadcrumbNameMap: Record<string, string> = {
  '/admin': '管理后台',
  '/admin/operations': '运营看板',
  '/admin/nutrition': '营养看板',
  '/admin/dishes': '餐品管理',
  '/admin/windows': '窗口管理',
  '/admin/canteens': '食堂管理',
}

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const pathSnippets = location.pathname.split('/').filter((i) => i)

  const breadcrumbItems = [
    { title: <a onClick={() => navigate('/')}>首页</a> },
    { title: '管理后台' },
    ...pathSnippets.slice(1).map((_, idx) => {
      const url = `/${pathSnippets.slice(0, idx + 2).join('/')}`
      return { title: breadcrumbNameMap[url] || url }
    }),
  ]

  const menuItems = [
    { key: '/admin/operations', icon: <DashboardOutlined />, label: '运营看板' },
    { key: '/admin/nutrition', icon: <ExperimentOutlined />, label: '营养看板' },
    { key: '/admin/dishes', icon: <AppleOutlined />, label: '餐品管理' },
    { key: '/admin/windows', icon: <ShopOutlined />, label: '窗口管理' },
    ...(user?.role === 'admin'
      ? [{ key: '/admin/canteens', icon: <HomeOutlined />, label: '食堂管理' }]
      : []),
  ]

  const userMenu = {
    items: [
      { key: 'back', icon: <HomeOutlined />, label: '返回前台' },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        logout()
        navigate('/login')
      } else if (key === 'back') {
        navigate('/')
      }
    },
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} style={{ background: '#fff' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>食堂管理</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <Breadcrumb items={breadcrumbItems} />
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<DashboardOutlined />} />
              <span>{user?.name || user?.user_id}</span>
              <span style={{ color: '#999', fontSize: 12 }}>({user?.role === 'admin' ? '管理员' : user?.role === 'manager' ? '食堂经理' : '学生'})</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
