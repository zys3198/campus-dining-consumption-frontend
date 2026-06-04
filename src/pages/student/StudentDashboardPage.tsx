import { Row, Col, Card } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import { StatCard } from '@/components/common/StatCard'

export default function StudentDashboardPage() {
  const { data } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: dashboardApi.student,
  })

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}><StatCard title="近30天消费" value={data?.month_total_amount ?? 0} suffix="元" precision={2} /></Col>
        <Col span={6}><StatCard title="消费次数" value={data?.month_consumption_count ?? 0} suffix="次" /></Col>
        <Col span={6}><StatCard title="次均消费" value={data?.month_avg_amount ?? 0} suffix="元" precision={2} /></Col>
        <Col span={6}><StatCard title="营养评分" value={data?.nutrition_score || '暂无'} /></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="基本信息">
            <p>姓名：{data?.student_name || '暂无'}</p>
            <p>院系：{data?.department || '暂无'}</p>
            <p>就餐偏好：{data?.time_preference || '暂无'}</p>
            <p>最爱食堂：{data?.favorite_canteen || '暂无'}</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="消费趋势">
            <p style={{ color: '#64748B', fontSize: 14 }}>消费总额</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#0D9488' }}>¥{data?.month_total_amount?.toFixed(2) ?? '0.00'}</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
