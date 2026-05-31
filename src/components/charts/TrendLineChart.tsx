import React from 'react'
import ReactECharts from 'echarts-for-react'

interface TrendDataPoint {
  date: string
  count: number
  amount: number
}

interface TrendLineChartProps {
  data: TrendDataPoint[]
  dataKey?: 'amount' | 'count'
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ data, dataKey = 'amount' }) => {
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.map(d => d.date), boundaryGap: false },
    yAxis: { type: 'value' },
    series: [{
      name: dataKey === 'amount' ? '销售额' : '订单数',
      type: 'line',
      data: data.map(d => d[dataKey]),
      smooth: true,
      areaStyle: {},
    }],
  }
  return <ReactECharts option={option} style={{ height: 300 }} />
}