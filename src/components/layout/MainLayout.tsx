import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Tag } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/auth'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import KeepAlive from '@/components/common/KeepAlive'

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
    ],
    admin: [
      { key: '/admin/dashboard', icon: <HomeOutlined />, label: '管理后台' },
      { key: '/admin/operations', icon: <BarChartOutlined />, label: '运营看板' },
      { key: '/admin/nutrition', icon: <LineChartOutlined />, label: '营养看板' },
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
          background: '#FFFFFF',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          borderRight: '1px solid var(--gray-200)',
          zIndex: 20,
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '22px 20px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid var(--gray-100)',
          marginBottom: 4,
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)',
          }}>
            🍜
          </div>
          <div>
            <div style={{
              color: 'var(--gray-800)',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}>
              校园食堂
            </div>
            <div style={{
              color: 'var(--gray-400)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.02em',
              lineHeight: 1.2,
            }}>
              消费管理系统
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="sidebar-menu"
        />
      </Sider>

      <Layout style={{ marginLeft: 220 }}>
        <Header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 32px',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          borderBottom: '1px solid var(--gray-200)',
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
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              padding: '2px 14px',
              lineHeight: '24px',
              height: 26,
              display: 'flex',
              alignItems: 'center',
              border: 'none',
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
                }}
              />
              <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{user?.name || user?.user_id}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{
          padding: '24px 28px',
          background: 'var(--bg-page)',
          minHeight: 'calc(100vh - 64px)',
        }}>
          <ErrorBoundary>
            <KeepAlive />
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
