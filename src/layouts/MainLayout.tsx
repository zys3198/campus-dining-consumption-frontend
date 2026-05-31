import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd'
import {
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  RadarChartOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/auth'

const { Header, Content } = Layout

export const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/dishes', icon: <FileTextOutlined />, label: '餐品' },
    { key: '/realtime', icon: <RadarChartOutlined />, label: '实时大屏' },
    ...(user?.role === 'student'
      ? [
          { key: '/transactions', icon: <FileTextOutlined />, label: '消费记录' },
          { key: '/profile', icon: <UserOutlined />, label: '个人中心' },
        ]
      : []),
  ]

  const userMenu = {
    items: [
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        logout()
        navigate('/login')
      }
    },
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: '#001529' }}>
        <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginRight: 40 }}>
          校园食堂
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1 }}
        />
        <Dropdown menu={userMenu} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span style={{ color: '#fff' }}>{user?.name || user?.user_id}</span>
          </Space>
        </Dropdown>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default MainLayout
