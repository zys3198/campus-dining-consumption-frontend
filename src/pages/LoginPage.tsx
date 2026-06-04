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
      background: 'linear-gradient(135deg, #0F766E 0%, #0F172A 60%, #1E293B 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blur circles */}
      <div style={{
        position: 'absolute',
        top: '-8%',
        right: '-4%',
        width: 420,
        height: 420,
        borderRadius: '50%',
        background: 'rgba(20, 184, 166, 0.12)',
        filter: 'blur(80px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-8%',
        left: '-4%',
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.08)',
        filter: 'blur(60px)',
      }} />

      <Card style={{
        width: 420,
        borderRadius: 16,
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28,
            boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
          }}>
            🍜
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
            校园食堂系统
          </h1>
          <p style={{ color: '#64748B', fontSize: 14 }}>
            请登录您的账号
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
