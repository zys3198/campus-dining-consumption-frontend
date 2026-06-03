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
    tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: data.map(d => ({ name: d.meal_name, value: d.amount })),
      emphasis: { label: { show: true, fontSize: 14 } },
    }],
  }
  return <ReactECharts option={option} style={{ height: 300 }} />
}
