import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLogin } from '@/hooks/useLogin'
import { Form, Input, Button } from 'antd'

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useLogin()
  const navigate = useNavigate()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    const success = await login(values.username, values.password)
    setLoading(false)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(150deg, #F0FDF9 0%, #FFF7ED 40%, #FEF3C7 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: 400,
        padding: 40,
        borderRadius: 16,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 28,
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
          }}>
            🍜
          </div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--gray-900)',
            marginBottom: 6,
            letterSpacing: '-0.02em',
          }}>
            校园食堂
          </h1>
          <p style={{
            color: 'var(--gray-500)',
            fontSize: 14,
            fontWeight: 400,
          }}>
            消费管理系统
          </p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--gray-400)' }} />}
              placeholder="用户名"
              style={{
                background: 'var(--gray-25)',
                borderRadius: 8,
                height: 44,
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--gray-400)' }} />}
              placeholder="密码"
              style={{
                background: 'var(--gray-25)',
                borderRadius: 8,
                height: 44,
                fontSize: 16,
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
