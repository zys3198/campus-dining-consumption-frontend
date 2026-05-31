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
    tooltip: {},
    legend: { data: ['摄入', 'DRI标准'] },
    radar: { indicator },
    series: [{
      type: 'radar',
      data: [
        { name: '摄入', value: intakeValue },
        { name: 'DRI标准', value: driValue },
      ],
    }],
  }
  return <ReactECharts option={option} style={{ height: 300 }} />
}