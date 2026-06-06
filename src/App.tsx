import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { App as AntApp, ConfigProvider, Spin, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/LoginPage'

// 学生页面
import StudentDashboardPage from './pages/student/StudentDashboardPage'
import TransactionListPage from './pages/student/TransactionListPage'
import NutritionAnalysisPage from './pages/student/NutritionAnalysisPage'
import ProfilePage from './pages/ProfilePage'

// 经理页面
import OperationsDashboardPage from './pages/manager/OperationsDashboardPage'
import QueueAnalysisPage from './pages/manager/QueueAnalysisPage'

// 管理员页面
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import NutritionDashboardPage from './pages/admin/NutritionDashboardPage'
import AISqlQueryPage from './pages/admin/AISqlQueryPage'
import CanteenManagePage from './pages/admin/manage/CanteenManagePage'
import WindowManagePage from './pages/admin/manage/WindowManagePage'
import DishManagePage from './pages/admin/manage/DishManagePage'
import StudentManagePage from './pages/admin/manage/StudentManagePage'
import DataImportPage from './pages/admin/DataImportPage'

import { useAuthStore } from './stores/auth'

const RootRedirect: React.FC = () => {
  const { token, user } = useAuthStore()
  if (!token || !user) return <Navigate to="/login" replace />
  const roleRoutes: Record<string, string> = {
    student: '/student/dashboard',
    manager: '/manager/operations',
    admin: '/admin/dashboard',
  }
  return <Navigate to={roleRoutes[user.role] || '/login'} replace />
}

const RoleRoute: React.FC<{ role: string }> = ({ role }) => {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== role) return <Navigate to="/" replace />
  return <Outlet />
}

const App: React.FC = () => {
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated())

  useEffect(() => {
    if (!hydrated) {
      const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
      return unsub
    }
  }, [hydrated])

  if (!hydrated) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#0D9488',
          colorSuccess: '#10B981',
          colorWarning: '#F59E0B',
          colorError: '#EF4444',
          colorInfo: '#6366F1',
          borderRadius: 6,
          colorBgContainer: '#FFFFFF',
          colorBgLayout: '#F8F9FB',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
          fontSize: 14,
          colorText: '#373F4C',
          colorTextSecondary: '#6D7583',
          colorBorder: '#E4E8EE',
          colorBorderSecondary: '#F2F4F7',
          controlHeight: 38,
          lineHeight: 1.6,
          paddingLG: 20,
          marginLG: 24,
        },
        components: {
          Card: {
            borderRadiusLG: 10,
            paddingLG: 20,
          },
          Table: {
            borderRadiusLG: 10,
            headerBg: '#F8F9FB',
            headerColor: '#6D7583',
            rowHoverBg: '#FCFDFD',
            borderColor: '#E4E8EE',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#F0FDF9',
            itemHoverBg: '#F2F4F7',
            itemColor: '#4B5362',
            itemSelectedColor: '#0D9488',
            itemHoverColor: '#232A35',
            subMenuItemBg: 'transparent',
            iconSize: 18,
            collapsedIconSize: 18,
            itemHeight: 38,
            itemMarginInline: 8,
            itemBorderRadius: 6,
          },
          Button: {
            borderRadius: 6,
            controlHeight: 38,
            fontWeight: 500,
          },
          Tabs: {
            inkBarColor: '#0D9488',
            itemActiveColor: '#0D9488',
            itemSelectedColor: '#0D9488',
          },
          Progress: {
            remainingColor: '#F2F4F7',
          },
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <AntApp>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* 根路由 - 按角色重定向 */}
          <Route path="/" element={<RootRedirect />} />

          {/* 学生路由 */}
          <Route element={<RoleRoute role="student" />}>
            <Route element={<MainLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboardPage />} />
              <Route path="/student/transactions" element={<TransactionListPage />} />
              <Route path="/student/nutrition" element={<NutritionAnalysisPage />} />
              <Route path="/student/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* 经理路由 */}
          <Route element={<RoleRoute role="manager" />}>
            <Route element={<MainLayout />}>
              <Route path="/manager/operations" element={<OperationsDashboardPage />} />
              <Route path="/manager/queue" element={<QueueAnalysisPage />} />
            </Route>
          </Route>

          {/* 管理员路由 */}
          <Route element={<RoleRoute role="admin" />}>
            <Route element={<MainLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/operations" element={<OperationsDashboardPage />} />
              <Route path="/admin/nutrition" element={<NutritionDashboardPage />} />
              <Route path="/admin/ai-query" element={<AISqlQueryPage />} />
              <Route path="/admin/canteens" element={<CanteenManagePage />} />
              <Route path="/admin/windows" element={<WindowManagePage />} />
              <Route path="/admin/dishes" element={<DishManagePage />} />
              <Route path="/admin/students" element={<StudentManagePage />} />
              <Route path="/admin/data-import" element={<DataImportPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
