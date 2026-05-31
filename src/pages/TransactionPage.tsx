import React, { useState } from 'react'
import { Card, Table, Button, Space, DatePicker, Typography, Tag, Row, Col, Statistic } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { transactionApi } from '@/api/dashboard'
import type { TransactionResponse } from '@/types'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const mealLabels: Record<number, string> = { 1: '早餐', 2: '午餐', 3: '晚餐', 4: '夜宵' }
const paymentLabels: Record<number, string> = { 1: '一卡通', 2: '微信', 3: '支付宝', 4: '其他' }

const TransactionPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>([undefined, undefined])

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', { page, pageSize, dateRange }],
    queryFn: () => transactionApi.list({
      page,
      page_size: pageSize,
      start_date: dateRange[0],
      end_date: dateRange[1],
    }),
  })

  const { data: stats } = useQuery({
    queryKey: ['transaction-stats'],
    queryFn: () => transactionApi.stats(),
  })

  const columns = [
    {
      title: '时间',
      dataIndex: 'txn_time',
      key: 'txn_time',
      render: (t: string) => new Date(t).toLocaleString('zh-CN'),
    },
    {
      title: '窗口',
      dataIndex: 'window_name',
      key: 'window_name',
    },
    {
      title: '餐次',
      dataIndex: 'meal_type',
      key: 'meal_type',
      render: (m: number) => <Tag color="blue">{mealLabels[m] || m}</Tag>,
    },
    {
      title: '金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (a: number) => <Text style={{ color: '#f5222d', fontWeight: 500 }}>¥{a.toFixed(2)}</Text>,
    },
    {
      title: '支付',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (p: number) => paymentLabels[p] || '-',
    },
    {
      title: '餐品',
      dataIndex: 'dishes',
      key: 'dishes',
      render: (dishes: TransactionResponse['dishes']) => (
        <Text type="secondary">
          {dishes.map((d) => `${d.dish_name || d.dish_id} x${d.quantity}`).join(', ')}
        </Text>
      ),
    },
  ]

  return (
    <Card>
      <Title level={4}>消费记录</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="本月消费" value={stats?.total_amount || 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="消费次数" value={stats?.total_count || 0} suffix="次" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="平均金额" value={stats?.avg_amount || 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="消费窗口" value={stats?.window_count || 0} suffix="个" />
          </Card>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16 }}>
        <RangePicker
          onChange={(_, dateStrings) => {
            setDateRange([dateStrings[0] || undefined, dateStrings[1] || undefined])
            setPage(1)
          }}
        />
        <Button icon={<ExportOutlined />}>导出</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="txn_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: data?.meta?.total,
          onChange: (p, ps) => { setPage(p); setPageSize(ps || 10) },
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Card>
  )
}

export default TransactionPage
