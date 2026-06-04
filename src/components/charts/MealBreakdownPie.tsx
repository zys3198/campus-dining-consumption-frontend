import React from 'react'
import { Empty } from 'antd'
import ReactECharts from 'echarts-for-react'
import type { MealTypeBreakdown } from '@/types'

interface MealBreakdownPieProps {
  data: MealTypeBreakdown[]
}

export const MealBreakdownPie: React.FC<MealBreakdownPieProps> = ({ data }) => {
  if (!data.length) {
    return <Empty description="暂无餐段数据" style={{ padding: 48 }} />
  }
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ¥{c} ({d}%)',
      backgroundColor: '#1E293B',
      borderColor: '#334155',
      textStyle: { color: '#F1F5F9', fontSize: 13 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#64748B' },
    },
    color: ['#0D9488', '#F59E0B', '#6366F1', '#EF4444'],
    series: [{
      type: 'pie',
      radius: ['45%', '72%'],
      data: data.map(d => ({ name: d.meal_name, value: d.amount })),
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' },
      },
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2,
      },
    }],
  }
  return <ReactECharts option={option} style={{ height: 300 }} />
}
