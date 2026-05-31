import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Spin, Typography, Badge } from 'antd'
import { ShopOutlined, AppleOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons'
import { canteenApi } from '@/api/resources'
import { dashboardApi } from '@/api/dashboard'
import type { CanteenListResponse, RealtimeDashboard } from '@/types'

const { Title, Text } = Typography

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [canteens, setCanteens] = useState<CanteenListResponse[]>([])
  const [realtime, setRealtime] = useState<RealtimeDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      canteenApi.list(),
      dashboardApi.realtime(),
    ]).then(([c, r]) => {
      setCanteens(c)
      setRealtime(r)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />

  return (
    <div>
      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日营收"
              value={realtime?.today_total_amount || 0}
              prefix={<DollarOutlined />}
              precision={2}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={realtime?.today_total_count || 0}
              prefix={<TeamOutlined />}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="营业窗口"
              value={realtime?.windows?.length || 0}
              prefix={<ShopOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="餐品总数"
              value={0}
              prefix={<AppleOutlined />}
              suffix="种"
              loading
            />
          </Card>
        </Col>
      </Row>

      {/* Canteens */}
      <Title level={4}>食堂列表</Title>
      <Row gutter={[16, 16]}>
        {canteens.map((canteen) => (
          <Col span={8} key={canteen.canteen_id}>
            <Card
              hoverable
              onClick={() => navigate(`/dishes?canteen=${canteen.canteen_id}`)}
              style={{ borderRadius: 8 }}
            >
              <Card.Meta
                title={canteen.name}
                description={
                  <>
                    <Text type="secondary">{canteen.location}</Text>
                    <br />
                    <Badge count={`${canteen.window_count} 个窗口`} style={{ marginTop: 8 }} />
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default HomePage
