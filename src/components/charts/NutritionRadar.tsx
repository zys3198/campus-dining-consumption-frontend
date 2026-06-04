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
      backgroundColor: '#1E293B',
      borderColor: '#334155',
      textStyle: { color: '#F1F5F9', fontSize: 13 },
    },
    legend: {
      data: ['摄入', 'DRI标准'],
      bottom: 0,
      textStyle: { color: '#64748B' },
    },
    radar: {
      indicator,
      shape: 'circle' as const,
      splitArea: {
        areaStyle: {
          color: ['#F0FDFA', '#CCFBF1', '#F0FDFA', '#CCFBF1'],
        },
      },
      axisLine: { lineStyle: { color: '#E2E8F0' } },
      splitLine: { lineStyle: { color: '#E2E8F0' } },
      axisName: { color: '#64748B', fontSize: 11 },
    },
    series: [{
      type: 'radar',
      data: [
        {
          name: '摄入',
          value: intakeValue,
          areaStyle: { color: 'rgba(13, 148, 136, 0.18)' },
          lineStyle: { color: '#0D9488', width: 2 },
          itemStyle: { color: '#0D9488' },
        },
        {
          name: 'DRI标准',
          value: driValue,
          areaStyle: { color: 'rgba(99, 102, 241, 0.08)' },
          lineStyle: { color: '#6366F1', width: 2, type: 'dashed' as const },
          itemStyle: { color: '#6366F1' },
        },
      ],
    }],
  }
  return <ReactECharts option={option} style={{ height: 300 }} />
}
