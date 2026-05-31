import React from 'react'
import { Card, Row, Col, Statistic, Progress, Table } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

const AdminNutritionPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['nutrition-dashboard'],
    queryFn: dashboardApi.nutrition,
  })

  const columns = [
    { title: '餐品', dataIndex: 'dish_name', key: 'dish_name' },
    {
      title: '营养评分',
      dataIndex: 'score',
      key: 'score',
      render: (s: number) => <Progress percent={s} size="small" status={s > 80 ? 'success' : s > 60 ? 'normal' : 'exception'} />,
    },
  ]

  return (
    <Card title="营养看板">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="平均热量" value={data?.avgCalories || 0} suffix="kcal" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均蛋白质" value={data?.avgProtein || 0} suffix="g" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均脂肪" value={data?.avgFat || 0} suffix="g" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均碳水" value={data?.avgCarbs || 0} suffix="g" loading={isLoading} />
          </Card>
        </Col>
      </Row>

      <Card title="营养优质餐品 TOP">
        <Table size="small" columns={columns} dataSource={data?.topNutritiousDishes} rowKey="dish_id" pagination={false} loading={isLoading} />
      </Card>
    </Card>
  )
}


export default AdminNutritionPage
