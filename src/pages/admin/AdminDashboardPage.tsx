import { useState } from 'react'
import { Row, Col, DatePicker } from 'antd'
import { useQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { dashboardApi } from '@/api/dashboard'
import { StatCard } from '@/components/common/StatCard'

export default function AdminDashboardPage() {
  const [date, setDate] = useState<Dayjs>(dayjs())
  const dateStr = date.format('YYYY-MM-DD')

  const opsQuery = useQuery({
    queryKey: ['admin-operations', dateStr],
    queryFn: () => dashboardApi.operations({ date: dateStr }),
  })
  const nutQuery = useQuery({
    queryKey: ['admin-nutrition', dateStr],
    queryFn: () => dashboardApi.nutrition({ date: dateStr }),
  })

  return (
    <div>
      <div className="page-header">管理后台</div>
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
      <Row gutter={16}>
        <Col span={6}><StatCard title="销售额" value={opsQuery.data?.today?.total_amount ?? 0} suffix="元" precision={2} /></Col>
        <Col span={6}><StatCard title="订单" value={opsQuery.data?.today?.total_count ?? 0} suffix="笔" /></Col>
        <Col span={6}><StatCard title="平均热量" value={nutQuery.data?.avg_energy_kcal ?? 0} suffix="kcal" precision={1} /></Col>
        <Col span={6}><StatCard title="营养预警" value={nutQuery.data?.alert_count ?? 0} suffix="人" /></Col>
      </Row>
    </div>
  )
}
