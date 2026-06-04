import { useState } from 'react'
import { Row, Col, Card, Tabs, Table, DatePicker } from 'antd'
import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { dashboardApi } from '@/api/dashboard'
import { StatCard } from '@/components/common/StatCard'
import { TrendLineChart } from '@/components/charts/TrendLineChart'
import { MealBreakdownPie } from '@/components/charts/MealBreakdownPie'
import { CongestionBar } from '@/components/charts/CongestionBar'

export default function OperationsDashboardPage() {
  const [date, setDate] = useState<Dayjs>(dayjs())
  const dateStr = date.format('YYYY-MM-DD')

  const { data, isLoading } = useQuery({
    queryKey: ['operations-dashboard', dateStr],
    queryFn: () => dashboardApi.operations({ date: dateStr }),
  })

  const tabItems = [
    {
      key: 'overview',
      label: '今日概览',
      children: (
        <Row gutter={16}>
          <Col span={6}><StatCard title="今日销售额" value={data?.today?.total_amount ?? 0} suffix="元" precision={2} /></Col>
          <Col span={6}><StatCard title="今日订单数" value={data?.today?.total_count ?? 0} suffix="笔" /></Col>
          <Col span={6}><StatCard title="就餐人数" value={data?.today?.student_count ?? 0} suffix="人" /></Col>
          <Col span={6}><StatCard title="人均消费" value={data?.today?.avg_per_person ?? 0} suffix="元" precision={2} /></Col>
        </Row>
      ),
    },
    {
      key: 'windows',
      label: '窗口排行',
      children: (
        <Table
          dataSource={data?.top_windows}
          columns={[
            { title: '窗口名', dataIndex: 'window_name', key: 'window_name' },
            { title: '食堂', dataIndex: 'canteen_name', key: 'canteen_name' },
            { title: '销售额', dataIndex: 'total_amount', key: 'total_amount', render: (v: number) => `¥${v.toFixed(2)}` },
            { title: '订单数', dataIndex: 'transaction_count', key: 'transaction_count' },
          ]}
          rowKey="window_id"
          loading={isLoading}
        />
      ),
    },
    {
      key: 'trend',
      label: '7日趋势',
      children: <Card><TrendLineChart data={data?.trend_7d ?? []} dataKey="amount" /></Card>,
    },
    {
      key: 'meal',
      label: '餐段分解',
      children: <Card><MealBreakdownPie data={data?.meal_breakdown ?? []} /></Card>,
    },
    {
      key: 'congestion',
      label: '实时拥堵',
      children: <Card><CongestionBar data={data?.congestion ?? []} /></Card>,
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#64748B', fontSize: 14 }}>选择日期：</span>
        <DatePicker
          value={date}
          onChange={(d) => d && setDate(d)}
          allowClear={false}
          maxDate={dayjs()}
          style={{ width: 180 }}
        />
      </div>
      <Tabs items={tabItems} />
    </div>
  )
}
