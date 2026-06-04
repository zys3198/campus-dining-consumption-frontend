import React from 'react'
import { Card, Tag, Row, Col, Statistic } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { canteenApi } from '@/api/resources'

const AdminCanteenPage: React.FC = () => {
  const { data: canteens } = useQuery({
    queryKey: ['canteens'],
    queryFn: () => canteenApi.list(),
  })

  return (
    <Card title="食堂管理">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {canteens?.map((c) => (
          <Col span={8} key={c.canteen_id}>
            <Card size="small">
              <Statistic title={c.name} value={c.window_count} suffix="个窗口" />
              <div style={{ marginTop: 8 }}>
                <Tag>{c.location || '暂无位置'}</Tag>
                {c.floor && <Tag>{(c.floor as number) > 0 ? `${c.floor}层` : '地下'}</Tag>}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default AdminCanteenPage
