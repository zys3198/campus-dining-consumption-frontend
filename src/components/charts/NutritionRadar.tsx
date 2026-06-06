import React from 'react'
import ReactECharts from 'echarts-for-react'

interface NutritionRadarProps {
  values: { energy: number; protein: number; fat: number; carbs: number; fiber?: number; sodium?: number }
  dri: { energy: number; protein: number; fat: number; carbs: number; fiber?: number; sodium?: number }
}

export const NutritionRadar: React.FC<NutritionRadarProps> = ({ values, dri }) => {
  const includeFiber = values.fiber !== undefined
  const indicator = [
    { name: '热量(kcal)', max: Math.max(dri.energy * 1.5, values.energy * 1.2) },
    { name: '蛋白质(g)', max: Math.max(dri.protein * 1.5, values.protein * 1.2) },
    { name: '脂肪(g)', max: Math.max(dri.fat * 1.5, values.fat * 1.2) },
    { name: '碳水(g)', max: Math.max(dri.carbs * 1.5, values.carbs * 1.2) },
    ...(includeFiber ? [{ name: '膳食纤维(g)', max: 50 }] : []),
  ]

  const intakeValue = [values.energy, values.protein, values.fat, values.carbs]
  const driValue = [dri.energy, dri.protein, dri.fat, dri.carbs]
  if (includeFiber) {
    intakeValue.push(values.fiber!)
    driValue.push(dri.fiber ?? 25)
  }

  const option = {
    tooltip: {
      backgroundColor: '#232A35',
      borderColor: '#373F4C',
      textStyle: { color: '#F2F4F7', fontSize: 13 },
    },
    legend: {
      data: ['摄入', 'DRI标准'],
      bottom: 0,
      textStyle: { color: '#6D7583' },
    },
    radar: {
      indicator,
      shape: 'circle' as const,
      splitArea: {
        areaStyle: {
          color: ['#FCFDFD', '#F8F9FB', '#FCFDFD', '#F8F9FB'],
        },
      },
      axisLine: { lineStyle: { color: '#E4E8EE' } },
      splitLine: { lineStyle: { color: '#E4E8EE' } },
      axisName: { color: '#6D7583', fontSize: 11 },
    },
    series: [{
      type: 'radar',
      data: [
        {
          name: '摄入',
          value: intakeValue,
          areaStyle: { color: 'rgba(13, 148, 136, 0.10)' },
          lineStyle: { color: '#0D9488', width: 2 },
          itemStyle: { color: '#0D9488' },
        },
        {
          name: 'DRI标准',
          value: driValue,
          areaStyle: { color: 'rgba(99, 102, 241, 0.06)' },
          lineStyle: { color: '#6366F1', width: 2, type: 'dashed' as const },
          itemStyle: { color: '#6366F1' },
        },
      ],
    }],
  }
  return <ReactECharts option={option} style={{ height: 300 }} />
}
