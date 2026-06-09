import React from 'react'
import { Card, Statistic } from 'antd'

interface StatCardProps {
  title: string
  value: number | string
  suffix?: string
  prefix?: React.ReactNode
  trend?: number
  precision?: number
  icon?: React.ReactNode
  color?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, suffix, prefix, trend, precision = 0, icon, color }) => {
  const trendColor = trend && trend < 0 ? 'var(--error)' : trend && trend > 0 ? 'var(--success)' : undefined
  const accentColor = color || 'var(--accent)'

  return (
    <Card
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
      styles={{
        body: { padding: '20px 24px' },
      }}
    >
      {/* Accent top bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
        opacity: 0.5,
      }} />

      {icon && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${accentColor}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          color: accentColor,
        }}>
          {icon}
        </div>
      )}

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
          color: trendColor || 'var(--gray-800)',
          fontWeight: 650,
          fontSize: 28,
        }}
      />
    </Card>
  )
}

export default StatCard
export { StatCard }
