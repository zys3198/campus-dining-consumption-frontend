import React from 'react'
import { Card, Statistic } from 'antd'

interface StatCardProps {
  title: string
  value: number | string
  suffix?: string
  prefix?: React.ReactNode
  trend?: number
  precision?: number
}

const StatCard: React.FC<StatCardProps> = ({ title, value, suffix, prefix, trend, precision = 0 }) => {
  return (
    <Card
      style={{
        border: 'none',
        borderRadius: 10,
      }}
      styles={{
        body: { padding: '20px 24px' },
      }}
    >
      <Statistic
        title={title}
        value={value}
        precision={precision}
        suffix={suffix}
        prefix={
          prefix ? (
            <span style={{ color: 'var(--gray-400)', fontSize: 13, fontWeight: 500 }}>
              {prefix}
            </span>
          ) : undefined
        }
        valueStyle={{
          color: trend && trend < 0 ? 'var(--error, #EF4444)' : trend && trend > 0 ? 'var(--success, #10B981)' : 'var(--gray-800, #232A35)',
          fontWeight: 600,
        }}
      />
    </Card>
  )
}

export default StatCard
export { StatCard }
