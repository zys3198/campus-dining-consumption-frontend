import React from 'react'
import { Empty, List, Progress } from 'antd'
import type { CongestionItem } from '@/types'

interface CongestionBarProps {
  data: CongestionItem[]
}

const levelColor: Record<string, string> = { '畅通': '#10B981', '普通': '#0D9488', '拥堵': '#F59E0B', '严重': '#EF4444' }

export const CongestionBar: React.FC<CongestionBarProps> = ({ data }) => {
  if (!data.length) {
    return <Empty description="暂无拥堵数据" style={{ padding: 48 }} />
  }
  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ borderBlockEnd: '1px solid #F1F5F9' }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 500, color: '#1E293B' }}>{item.window_name}</span>
              <span style={{ color: levelColor[item.level] || '#64748B', fontWeight: 600 }}>{item.level}</span>
            </div>
            <Progress
              percent={Math.min((item.avg_wait_seconds / 600) * 100, 100)}
              strokeColor={levelColor[item.level] || '#0D9488'}
              showInfo={false}
              size="small"
            />
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
              平均等待 {item.avg_wait_seconds}s · 最大排队 {item.max_queue_length}人
            </div>
          </div>
        </List.Item>
      )}
    />
  )
}
