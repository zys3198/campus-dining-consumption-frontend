import React from 'react'
import { Card, Row, Col, Statistic, Table, Progress } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

const AdminOperationsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['operations-dashboard'],
    queryFn: dashboardApi.operations,
  })

  const topDishesColumns = [
    { title: '餐品', dataIndex: 'dish_name', key: 'dish_name' },
    { title: '销量', dataIndex: 'count', key: 'count' },
  ]

  const canteenColumns = [
    { title: '食堂', dataIndex: 'name', key: 'name' },
    { title: '营收', dataIndex: 'revenue', key: 'revenue', render: (r: number) => `¥${r.toFixed(2)}` },
    { title: '订单', dataIndex: 'transactions', key: 'transactions' },
  ]

  return (
    <Card title="运营看板">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="今日营收" value={data?.todayRevenue || 0} prefix="¥" precision={2} loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日订单" value={data?.todayTransactions || 0} suffix="笔" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="营业窗口" value={data?.activeWindows || 0} suffix="个" loading={isLoading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="客单价" value={data?.avgTransactionAmount || 0} prefix="¥" precision={2} loading={isLoading} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="餐次分布" style={{ marginBottom: 16 }}>
            {data?.mealTypeBreakdown && Object.entries(data.mealTypeBreakdown).map(([meal, count]) => (
              <div key={meal} style={{ marginBottom: 8 }}>
                <span>{['', '早餐', '午餐', '晚餐', '夜宵'][parseInt(meal)] || meal}</span>
                <Progress percent={Math.round((count / (data.todayTransactions || 1)) * 100)} size="small" />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="热销餐品" style={{ marginBottom: 16 }}>
            <Table size="small" columns={topDishesColumns} dataSource={data?.topDishes} rowKey="dish_id" pagination={false} loading={isLoading} />
          </Card>
        </Col>
      </Row>

      <Card title="各食堂经营情况">
        <Table size="small" columns={canteenColumns} dataSource={data?.canteenStats} rowKey="canteen_id" pagination={false} loading={isLoading} />
      </Card>
    </Card>
  )
}


export default AdminOperationsPage
