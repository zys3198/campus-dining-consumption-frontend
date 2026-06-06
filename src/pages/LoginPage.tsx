import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLogin } from '@/hooks/useLogin'
import { Form, Input, Button, Card } from 'antd'

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
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gray-50)',
    }}>
      <Card style={{
        width: 400,
        borderRadius: 14,
        boxShadow: 'var(--shadow-ring)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'var(--accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 24,
          }}>
            🍜
          </div>
          <h1 style={{
            fontSize: 22,
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
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
