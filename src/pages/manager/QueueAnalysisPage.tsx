import { useState } from 'react'
import { Card, Table, Tag, DatePicker, Row, Col, Statistic, Tabs } from 'antd'
import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { dashboardApi } from '@/api/dashboard'

const { RangePicker } = DatePicker

const levelColor: Record<string, string> = { '畅通': 'green', '轻微': 'blue', '拥堵': 'orange', '严重': 'red' }

export default function QueueAnalysisPage() {
  const today = dayjs()
  const [range, setRange] = useState<[Dayjs, Dayjs]>([today.subtract(7, 'day'), today])
  const startStr = range[0].format('YYYY-MM-DD')
  const endStr = range[1].format('YYYY-MM-DD')

  const { data, isLoading } = useQuery({
    queryKey: ['queue-analysis', startStr, endStr],
    queryFn: () => dashboardApi.queueAnalysis({ start_date: startStr, end_date: endStr }),
  })

  const dist = data?.congestion_distribution ?? []
  const totalRecords = dist.reduce((s, d) => s + d.count, 0)
  const congested = dist.filter((d) => d.level === '拥堵' || d.level === '严重')
  const congestedCount = congested.reduce((s, d) => s + d.count, 0)
  const congestedPct = totalRecords > 0 ? ((congestedCount / totalRecords) * 100).toFixed(1) : '0.0'

  const tabItems = [
    {
      key: 'efficiency',
      label: '窗口效率',
      children: (
        <Table
          dataSource={data?.window_efficiency ?? []}
          columns={[
            { title: '窗口名', dataIndex: 'window_name', key: 'window_name' },
            { title: '食堂', dataIndex: 'canteen_name', key: 'canteen_name' },
            { title: '平均等待(s)', dataIndex: 'avg_wait_duration', key: 'avg_wait_duration', render: (v: number) => v.toFixed(1) },
            { title: '最大等待(s)', dataIndex: 'max_wait_duration', key: 'max_wait_duration' },
            { title: '样本数', dataIndex: 'record_count', key: 'record_count' },
          ]}
          rowKey="window_id"
          loading={isLoading}
        />
      ),
    },
    {
      key: 'peak',
      label: '高峰时段',
      children: (
        <Table
          dataSource={data?.peak_hours ?? []}
          columns={[
            { title: '时段', dataIndex: 'hour', key: 'hour', render: (h: number) => `${String(h).padStart(2, '0')}:00` },
            { title: '样本数', dataIndex: 'record_count', key: 'record_count' },
            { title: '平均等待(s)', dataIndex: 'avg_wait_duration', key: 'avg_wait_duration', render: (v: number) => v.toFixed(1) },
          ]}
          rowKey="hour"
          loading={isLoading}
        />
      ),
    },
    {
      key: 'top',
      label: '拥堵窗口 Top5',
      children: (
        <Table
          dataSource={data?.top_congested_windows ?? []}
          columns={[
            { title: '窗口名', dataIndex: 'window_name', key: 'window_name' },
            { title: '平均等待(s)', dataIndex: 'avg_wait_duration', key: 'avg_wait_duration', render: (v: number) => v.toFixed(1) },
            { title: '样本数', dataIndex: 'record_count', key: 'record_count' },
          ]}
          rowKey="window_id"
          loading={isLoading}
        />
      ),
    },
    {
      key: 'dist',
      label: '等级分布',
      children: (
        <Table
          dataSource={dist}
          columns={[
            { title: '等级', dataIndex: 'level', key: 'level', render: (l: string) => <Tag color={levelColor[l] || 'default'}>{l}</Tag> },
            { title: '记录数', dataIndex: 'count', key: 'count' },
            { title: '占比', dataIndex: 'percentage', key: 'percentage', render: (v: number) => `${v}%` },
          ]}
          rowKey="level"
          loading={isLoading}
          pagination={false}
        />
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">排队分析</div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#64748B', fontSize: 14 }}>选择日期范围：</span>
        <RangePicker
          value={range}
          onChange={(v) => v && setRange([v[0]!, v[1]!])}
          allowClear={false}
          maxDate={today}
          style={{ width: 280 }}
        />
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card><Statistic title="总记录数" value={totalRecords} suffix="条" loading={isLoading} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="拥堵/严重占比" value={congestedPct} suffix="%" loading={isLoading} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="分析窗口数" value={data?.window_efficiency?.length ?? 0} suffix="个" loading={isLoading} /></Card>
        </Col>
      </Row>

      <Card title="排队分析">
        <Tabs items={tabItems} />
      </Card>
    </div>
  )
}
