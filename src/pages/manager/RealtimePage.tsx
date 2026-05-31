import React from 'react'
import { Row, Col, Card, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import { useRealtimeSSE } from '@/hooks/useRealtimeSSE'
import { StatCard } from '@/components/common/StatCard'
import { CongestionBar } from '@/components/charts/CongestionBar'

export default function RealtimePage() {
  const { data: staticData } = useQuery({
    queryKey: ['realtime-dashboard'],
    queryFn: dashboardApi.realtime,
    refetchInterval: 30000,
  })

  const { data: sseData } = useRealtimeSSE('/api/dashboards/realtime/stream', true)

  const display = sseData || staticData

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}><StatCard title="今日销售额" value={display?.today_total_amount ?? 0} suffix="元" precision={2} /></Col>
        <Col span={8}><StatCard title="今日订单数" value={display?.today_total_count ?? 0} suffix="笔" /></Col>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#888' }}>拥堵窗口</div>
              <Tag color={display?.congestion_count ? 'red' : 'green'} style={{ fontSize: 18 }}>
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