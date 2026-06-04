import { Card, Row, Col, Statistic, Progress, Typography, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import type { CongestionItem } from '@/types'

const { Title, Text } = Typography

const levelToPercent: Record<string, number> = { '畅通': 25, '普通': 50, '拥堵': 75, '严重': 100 }
const levelToColor: Record<string, string> = { '畅通': '#52c41a', '普通': '#faad14', '拥堵': '#f5222d', '严重': '#ff0000' }

const RealtimePage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['realtime'],
    queryFn: () => dashboardApi.realtime(),
    refetchInterval: 30000,
  })

  if (isLoading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />

  return (
    <div style={{ background: '#001529', minHeight: '100vh', padding: 24 }}>
      <Title level={3} style={{ color: '#fff', textAlign: 'center', marginBottom: 32 }}>
        🍽️ 校园食堂实时大屏
      </Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Statistic
              title={<Text style={{ color: '#fff' }}>今日营收</Text>}
              value={data?.today_total_amount || 0}
              precision={2}
              suffix="元"
              valueStyle={{ color: '#fff', fontSize: 36 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
            <Statistic
              title={<Text style={{ color: '#fff' }}>今日订单</Text>}
              value={data?.today_total_count || 0}
              suffix="笔"
              valueStyle={{ color: '#fff', fontSize: 36 }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="窗口拥挤度">
        <Row gutter={[16, 16]}>
          {data?.windows?.map((w: CongestionItem) => (
            <Col span={8} key={w.window_id}>
              <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>{w.window_name}</Text>
                  <Progress
                    percent={levelToPercent[w.level] || 0}
                    size="small"
                    strokeColor={levelToColor[w.level] || '#52c41a'}
                  />
                </div>
              </Card>
            </Col>
          )) || <Col span={24}><Text type="secondary">暂无数据</Text></Col>}
        </Row>
      </Card>

      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 24, color: '#666' }}>
        数据每30秒自动刷新
      </Text>
    </div>
  )
}

export default RealtimePage
