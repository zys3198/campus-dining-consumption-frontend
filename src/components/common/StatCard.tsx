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
        borderRadius: 12,
        overflow: 'hidden',
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
        prefix={prefix}
        valueStyle={{
          color: trend && trend < 0 ? '#EF4444' : '#0D9488',
          fontWeight: 600,
        }}
        prefixStyle={{
          color: '#64748B',
          fontSize: 13,
          fontWeight: 500,
        }}
      />
    </Card>
  )
}

export default StatCard
export { StatCard }
