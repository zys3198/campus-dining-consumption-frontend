import { Card, Row, Col, Statistic } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

const AdminNutritionPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['nutrition-dashboard'],
    queryFn: dashboardApi.nutrition,
  })

  return (
    <Card title="营养看板">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="平均热量" value={data?.avg_energy_kcal || 0} suffix="kcal" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均蛋白质" value={data?.avg_protein_g || 0} suffix="g" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均脂肪" value={data?.avg_fat_g || 0} suffix="g" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均碳水" value={data?.avg_carbs_g || 0} suffix="g" loading={isLoading} />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}


export default AdminNutritionPage
