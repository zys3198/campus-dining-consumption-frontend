import { useState } from 'react'
import { Row, Col, Card, Tag, DatePicker } from 'antd'
import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { dashboardApi } from '@/api/dashboard'
import { useRealtimeSSE } from '@/hooks/useRealtimeSSE'
import { StatCard } from '@/components/common/StatCard'
import { CongestionBar } from '@/components/charts/CongestionBar'

export default function RealtimePage() {
  const [date, setDate] = useState<Dayjs>(dayjs())
  const dateStr = date.format('YYYY-MM-DD')
  const isToday = dateStr === dayjs().format('YYYY-MM-DD')

  const { data: staticData } = useQuery({
    queryKey: ['realtime-dashboard', dateStr],
    queryFn: () => dashboardApi.realtime({ date: dateStr }),
    refetchInterval: isToday ? 30000 : false,
  })

  // SSE 只在查看今天时启用
  const { data: sseData } = useRealtimeSSE('/api/v1/dashboards/realtime/stream', isToday)

  const display = isToday ? (sseData || staticData) : staticData

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
        {!isToday && <Tag color="orange">历史模式（非实时）</Tag>}
      </div>
      <Row gutter={16}>
        <Col span={8}><StatCard title="今日销售额" value={display?.today_total_amount ?? 0} suffix="元" precision={2} /></Col>
        <Col span={8}><StatCard title="今日订单数" value={display?.today_total_count ?? 0} suffix="笔" /></Col>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748B', fontSize: 13 }}>拥堵窗口</div>
              <Tag color={display?.congestion_count ? '#EF4444' : '#10B981'} style={{ fontSize: 18, marginTop: 8, borderRadius: 6 }}>
                {display?.congestion_count ?? 0} 个
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="实时窗口状态">
            <CongestionBar data={display?.windows ?? []} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
