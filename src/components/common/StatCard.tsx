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
    <Card>
      <Statistic
        title={title}
        value={value}
        precision={precision}
        suffix={suffix}
        prefix={prefix}
        valueStyle={{ color: trend && trend < 0 ? '#cf1322' : undefined }}
      />
    </Card>
  )
}

export default StatCard
export { StatCard }