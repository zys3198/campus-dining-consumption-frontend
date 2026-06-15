import React, { useMemo } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
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
import { Salad } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

const { Header, Content, Sider } = Layout

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

const roleTagColor: Record<string, string> = { student: '#0D9488', manager: '#6366F1', admin: '#EF4444' }
const roleLabel: Record<string, string> = { student: '学生', manager: '经理', admin: '管理员' }

const userMenu = {
  items: [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ],
}

export const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const menuItems = roleMenuMap[user?.role as keyof typeof roleMenuMap] || []

  const headerRight = useMemo(() => (
    <>
      <Tag
        color={roleTagColor[user?.role as keyof typeof roleTagColor]}
        style={{
          marginRight: 16,
          borderRadius: 8,
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
      <Dropdown
        menu={{ ...userMenu, onClick: ({ key }: { key: string }) => { if (key === 'logout') { logout(); navigate('/login') } } }}
        placement="bottomRight"
      >
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
            style={{ backgroundColor: '#0D9488' }}
          />
          <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{user?.name || user?.user_id}</span>
        </Space>
      </Dropdown>
    </>
  ), [user, logout, navigate])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: 'linear-gradient(180deg, #0D9488 0%, #0F766E 40%, #0A5C56 100%)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          zIndex: 20,
        }}
      >
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px 1px, transparent 1px 30px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px 1px, transparent 1px 30px)
          `,
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{
            padding: '24px 20px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: '1px solid rgba(255,255,255,0.10)',
            marginBottom: 6,
          }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.20)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}>
              <Salad size={20} strokeWidth={1.5} color="white" />
            </div>
            <div>
              <div style={{
                color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3,
              }}>
                校园食堂
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.2,
              }}>
                消费管理系统
              </div>
            </div>
          </div>

          {/* Navigation */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ background: 'transparent', borderInlineEnd: 'none' }}
          />
        </div>
      </Sider>

      <Layout style={{ marginLeft: 220 }}>
        <Header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 32px',
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--gray-200)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 64,
          lineHeight: '64px',
        }}>
          {headerRight}
        </Header>

        <Content style={{
          padding: '24px 28px',
          background: 'var(--bg-page)',
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
