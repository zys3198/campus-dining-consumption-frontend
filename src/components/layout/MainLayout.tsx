import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Tag } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  RadarChartOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/auth'

const { Header, Content, Sider } = Layout

export const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const roleMenuMap: Record<string, { key: string; icon: React.ReactNode; label: string }[]> = {
    student: [
      { key: '/student/dashboard', icon: <HomeOutlined />, label: '个人看板' },
      { key: '/student/transactions', icon: <ShoppingCartOutlined />, label: '消费记录' },
      { key: '/student/nutrition', icon: <BarChartOutlined />, label: '营养分析' },
      { key: '/student/profile', icon: <UserOutlined />, label: '个人中心' },
    ],
    manager: [
      { key: '/manager/operations', icon: <BarChartOutlined />, label: '运营看板' },
      { key: '/manager/queue', icon: <TeamOutlined />, label: '排队分析' },
      { key: '/manager/realtime', icon: <RadarChartOutlined />, label: '实时大屏' },
    ],
    admin: [
      { key: '/admin/dashboard', icon: <HomeOutlined />, label: '管理后台' },
      { key: '/admin/operations', icon: <BarChartOutlined />, label: '运营看板' },
      { key: '/admin/nutrition', icon: <LineChartOutlined />, label: '营养看板' },
      { key: '/admin/realtime', icon: <RadarChartOutlined />, label: '实时大屏' },
      { key: '/admin/ai-query', icon: <DatabaseOutlined />, label: 'AI查询' },
      { key: '/admin/canteens', icon: <TeamOutlined />, label: '食堂管理' },
      { key: '/admin/windows', icon: <TeamOutlined />, label: '窗口管理' },
      { key: '/admin/dishes', icon: <TeamOutlined />, label: '餐品管理' },
      { key: '/admin/students', icon: <TeamOutlined />, label: '学生管理' },
    ],
  }

  const menuItems = roleMenuMap[user?.role as keyof typeof roleMenuMap] || []

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

  const roleTagColor: Record<string, string> = { student: 'blue', manager: 'green', admin: 'red' }
  const roleLabel: Record<string, string> = { student: '学生', manager: '经理', admin: '管理员' }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        style={{ background: '#001529', flex: '0 0 200px' }}
      >
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          🍜 校园食堂
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <Tag color={roleTagColor[user?.role as keyof typeof roleTagColor]}>{roleLabel[user?.role as keyof typeof roleLabel]}</Tag>
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name || user?.user_id}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout