import { Card, Row, Col, Statistic, Table, Progress } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

const AdminOperationsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['operations-dashboard'],
    queryFn: dashboardApi.operations,
  })

  const topWindowsColumns = [
    { title: '窗口名', dataIndex: 'window_name', key: 'window_name' },
    { title: '食堂', dataIndex: 'canteen_name', key: 'canteen_name' },
    { title: '销售额', dataIndex: 'total_amount', key: 'total_amount', render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '订单数', dataIndex: 'transaction_count', key: 'transaction_count' },
  ]

  return (
    <Card title="运营看板">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="今日营收" value={data?.today.total_amount || 0} prefix="¥" precision={2} loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日订单" value={data?.today.total_count || 0} suffix="笔" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="就餐人数" value={data?.today.student_count || 0} suffix="人" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="人均消费" value={data?.today.avg_per_person || 0} prefix="¥" precision={2} loading={isLoading} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="餐次分布" style={{ marginBottom: 16 }}>
            {data?.meal_breakdown?.map((m) => (
              <div key={m.meal_type} style={{ marginBottom: 8 }}>
                <span>{m.meal_name}</span>
                <Progress percent={m.percentage} size="small" />
              </div>
            )) || <span>暂无数据</span>}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="热销窗口" style={{ marginBottom: 16 }}>
            <Table size="small" columns={topWindowsColumns} dataSource={data?.top_windows} rowKey="window_id" pagination={false} loading={isLoading} />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}


export default AdminOperationsPage
