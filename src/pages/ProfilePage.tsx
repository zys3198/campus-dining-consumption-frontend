import { Card, Avatar, Typography, Tag, Row, Col, Statistic } from 'antd'
import { UserOutlined, TrophyOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import { useAuthStore } from '@/stores/auth'

const { Title, Text } = Typography

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore()

  const { data } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => dashboardApi.student(),
  })

  return (
    <Card>
      <Row gutter={24}>
        <Col span={6}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: 16, backgroundColor: '#0D9488', boxShadow: '0 0 0 3px rgba(13,148,136,0.15)' }} />
            <Title level={4} style={{ marginBottom: 4 }}>{data?.student_name || user?.name}</Title>
            <Text type="secondary">{user?.department || user?.user_id}</Text>
            <br />
            <Tag color="#0D9488" style={{ marginTop: 8, borderRadius: 6 }}>{user?.role === 'student' ? '学生用户' : user?.role}</Tag>
          </Card>
        </Col>

        <Col span={18}>
          <Card title="消费概况" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="近30天消费"
                  value={data?.month_total_amount || 0}
                  prefix="¥"
                  precision={2}
                  valueStyle={{ color: '#EF4444', fontWeight: 600 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="常去食堂"
                  value={data?.favorite_canteen || '-'}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="就餐偏好"
                  value={data?.time_preference || '午餐'}
                  suffix={<TrophyOutlined />}
                />
              </Col>
            </Row>
          </Card>

          <Card title="营养评分">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="营养综合分"
                  value={data?.nutrition_score || '暂无'}
                  valueStyle={{ color: '#10B981', fontWeight: 600 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default ProfilePage
