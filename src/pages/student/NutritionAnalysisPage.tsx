import React from 'react'
import { Row, Col, Card, Table, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { nutritionApi } from '@/api/nutrition'
import { TrendLineChart } from '@/components/charts/TrendLineChart'
import { NutritionRadar } from '@/components/charts/NutritionRadar'

export default function NutritionAnalysisPage() {
  const reportQuery = useQuery({
    queryKey: ['nutrition-personal'],
    queryFn: () => nutritionApi.getPersonal(),
  })

  const trendQuery = useQuery({
    queryKey: ['nutrition-trend'],
    queryFn: () => nutritionApi.getTrend({ days: 30 }),
  })

  const driQuery = useQuery({
    queryKey: ['nutrition-dris'],
    queryFn: nutritionApi.getDRIs,
  })

  const evalColor: Record<string, string> = { '达标': 'green', '偏高': 'red', '偏低': 'orange' }

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="营养摄入趋势（30天）">
            <TrendLineChart
              data={trendQuery.data?.map(d => ({ date: String(d.date), count: d.energy_kcal, amount: d.energy_kcal })) ?? []}
              dataKey="amount"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="营养均衡雷达图">
            {driQuery.data && reportQuery.data?.averages && (
              <NutritionRadar
                values={{
                  energy: reportQuery.data.averages.energy_kcal,
                  protein: reportQuery.data.averages.protein_g,
                  fat: reportQuery.data.averages.fat_g,
                  carbs: reportQuery.data.averages.carbs_g,
                  fiber: reportQuery.data.averages.fiber_g ?? undefined,
                  sodium: reportQuery.data.averages.sodium_mg ?? undefined,
                }}
                dri={{
                  energy: driQuery.data.find(d => d.nutrient === 'energy_kcal')?.male_value ?? 2250,
                  protein: driQuery.data.find(d => d.nutrient === 'protein_g')?.male_value ?? 65,
                  fat: driQuery.data.find(d => d.nutrient === 'fat_g')?.male_value ?? 60,
                  carbs: driQuery.data.find(d => d.nutrient === 'carbs_g')?.male_value ?? 300,
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="营养达标评估">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {reportQuery.data?.evaluations && Object.entries(reportQuery.data.evaluations).map(([key, val]) => (
                <Tag key={key} color={evalColor[val] || 'default'} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {key}: {val}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="每日营养详情">
            <Table
              dataSource={reportQuery.data?.daily}
              columns={[
                { title: '日期', dataIndex: 'date', key: 'date', render: (d: string) => String(d) },
                { title: '热量(kcal)', dataIndex: 'energy_kcal', key: 'energy_kcal' },
                { title: '蛋白质(g)', dataIndex: 'protein_g', key: 'protein_g' },
                { title: '脂肪(g)', dataIndex: 'fat_g', key: 'fat_g' },
                { title: '碳水(g)', dataIndex: 'carbs_g', key: 'carbs_g' },
                { title: '蛋白质供能比', dataIndex: 'protein_ratio', key: 'protein_ratio', render: (v: number) => `${v ?? 0}%` },
                { title: '脂肪供能比', dataIndex: 'fat_ratio', key: 'fat_ratio', render: (v: number) => `${v ?? 0}%` },
              ]}
              rowKey="date"
              loading={reportQuery.isLoading}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}