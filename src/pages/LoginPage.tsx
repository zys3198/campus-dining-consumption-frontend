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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card style={{ width: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>校园食堂系统</h1>
          <p style={{ color: '#999' }}>请登录您的账号</p>
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
