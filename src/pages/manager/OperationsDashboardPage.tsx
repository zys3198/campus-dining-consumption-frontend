import { useState } from 'react'
import { Row, Col, Card, Tabs, Table, DatePicker, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { dashboardApi } from '@/api/dashboard'
import { useRealtimeSSE } from '@/hooks/useRealtimeSSE'
import { StatCard } from '@/components/common/StatCard'
import { TrendLineChart } from '@/components/charts/TrendLineChart'
import { MealBreakdownPie } from '@/components/charts/MealBreakdownPie'
import { CongestionBar } from '@/components/charts/CongestionBar'
import { CongestionHeatmap } from '@/components/charts/CongestionHeatmap'
import type { CongestionItem } from '@/types'

export default function OperationsDashboardPage() {
  const [date, setDate] = useState<Dayjs>(dayjs())
  const dateStr = date.format('YYYY-MM-DD')
  const isToday = dateStr === dayjs().format('YYYY-MM-DD')

  const { data, isLoading } = useQuery({
    queryKey: ['operations-dashboard', dateStr],
    queryFn: () => dashboardApi.operations({ date: dateStr }),
  })

  // Full-day heatmap data
  const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
    queryKey: ['congestion-heatmap', dateStr],
    queryFn: () => dashboardApi.heatmap(dateStr),
  })

  // SSE live push (today only)
  const { data: sseData } = useRealtimeSSE('/api/v1/dashboards/realtime/stream', isToday)

  // Prefer SSE congestion for today; fall back to operations data
  const congestion: CongestionItem[] = isToday && sseData?.windows?.length
    ? sseData.windows
    : (data?.congestion ?? [])

  const congestedCount = congestion.filter(
    (w) => w.level === '拥堵' || w.level === '严重',
  ).length

  const tabItems = [
    {
      key: 'overview',
      label: '概览',
      children: (
        <Row gutter={16}>
          <Col span={6}><StatCard title="销售额" value={data?.today?.total_amount ?? 0} suffix="元" precision={2} /></Col>
          <Col span={6}><StatCard title="订单数" value={data?.today?.total_count ?? 0} suffix="笔" /></Col>
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
      children: (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#64748B', fontSize: 13 }}>拥堵窗口</div>
                  <Tag
                    color={congestedCount > 0 ? '#EF4444' : '#10B981'}
                    style={{ fontSize: 18, marginTop: 8, borderRadius: 6 }}
                  >
                    {congestedCount} 个
                  </Tag>
                </div>
              </Card>
            </Col>
          </Row>
          <Card title="实时窗口状态" style={{ marginBottom: 16 }}>
            <CongestionBar data={congestion} />
          </Card>
          <Card title="全天拥堵热力图（15分钟分段）" loading={heatmapLoading}>
            <CongestionHeatmap data={heatmapData ?? []} />
          </Card>
        </>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">运营看板</div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#64748B', fontSize: 14 }}>选择日期：</span>
        <DatePicker
          value={date}
          onChange={(d) => d && setDate(d)}
          allowClear={false}
          maxDate={dayjs()}
          style={{ width: 180 }}
        />
        {!isToday && <Tag color="orange">历史模式（非实时）</Tag>}
      </div>
      <Tabs items={tabItems} />
    </div>
  )
}
