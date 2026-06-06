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
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#232A35',
      borderColor: '#373F4C',
      textStyle: { color: '#F2F4F7', fontSize: 13 },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#E4E8EE' } },
      axisLabel: { color: '#6D7583', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#6D7583', fontSize: 11 },
      splitLine: { lineStyle: { color: '#E4E8EE', type: 'dashed' } },
    },
    series: [{
      name: dataKey === 'amount' ? '销售额' : '订单数',
      type: 'line',
      data: data.map(d => d[dataKey]),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(13, 148, 136, 0.15)' },
            { offset: 1, color: 'rgba(13, 148, 136, 0.02)' },
          ],
        },
      },
      lineStyle: { color: '#0D9488', width: 2.5 },
      itemStyle: { color: '#0D9488', borderColor: '#fff', borderWidth: 2 },
    }],
  }
  return <ReactECharts option={option} style={{ height: 300 }} />
}
