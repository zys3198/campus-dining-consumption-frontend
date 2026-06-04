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
  ImportOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/auth'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

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
      { key: '/admin/data-import', icon: <ImportOutlined />, label: '数据导入' },
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

  const roleTagColor: Record<string, string> = { student: '#0D9488', manager: '#6366F1', admin: '#EF4444' }
  const roleLabel: Record<string, string> = { student: '学生', manager: '经理', admin: '管理员' }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          boxShadow: '2px 0 12px rgba(0,0,0,0.2)',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '22px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 4,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}>
            🍜
          </div>
          <span style={{
            color: '#F1F5F9',
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '0.3px',
          }}>
            校园食堂
          </span>
        </div>

        {/* Navigation */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0 4px',
          }}
          className="sidebar-menu"
        />
      </Sider>

      <Layout style={{ marginLeft: 220 }}>
        <Header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 32px',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 64,
          lineHeight: '64px',
        }}>
          <Tag
            color={roleTagColor[user?.role as keyof typeof roleTagColor]}
            style={{
              marginRight: 16,
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            {roleLabel[user?.role as keyof typeof roleLabel]}
          </Tag>
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{
              cursor: 'pointer',
              borderRadius: 8,
              padding: '4px 12px 4px 4px',
              transition: 'background 0.2s',
            }}
              className="user-dropdown-trigger"
            >
              <Avatar
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#0D9488',
                  boxShadow: '0 0 0 2px rgba(13,148,136,0.2)',
                }}
              />
              <span style={{ fontWeight: 500, color: '#1E293B' }}>{user?.name || user?.user_id}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{
          padding: '24px 28px',
          background: '#F1F5F9',
          minHeight: 'calc(100vh - 64px)',
        }}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
