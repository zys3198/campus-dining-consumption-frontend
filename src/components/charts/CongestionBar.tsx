import React from 'react'
import { List, Progress } from 'antd'
import type { CongestionItem } from '@/types'

interface CongestionBarProps {
  data: CongestionItem[]
}

const levelColor: Record<string, string> = { '畅通': '#52c41a', '普通': '#1890ff', '拥堵': '#fa8c16', '严重': '#cf1322' }

export const CongestionBar: React.FC<CongestionBarProps> = ({ data }) => {
  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{item.window_name}</span>
              <span style={{ color: levelColor[item.level] || '#888' }}>{item.level}</span>
            </div>
            <Progress
              percent={Math.min((item.avg_wait_seconds / 600) * 100, 100)}
              strokeColor={levelColor[item.level] || '#1890ff'}
              showInfo={false}
            />
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
              平均等待 {item.avg_wait_seconds}s / 最大排队 {item.max_queue_length}人
            </div>
          </div>
        </List.Item>
      )}
    />
  )
}