import { useState } from 'react'
import { Row, Col, Table, Tag, Tabs } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import { nutritionApi } from '@/api/nutrition'
import { StatCard } from '@/components/common/StatCard'

export default function NutritionDashboardPage() {
  const [groupBy, setGroupBy] = useState<'department' | 'grade'>('department')

  const nutQuery = useQuery({ queryKey: ['admin-nutrition'], queryFn: dashboardApi.nutrition })
  const groupQuery = useQuery({
    queryKey: ['nutrition-group', groupBy],
    queryFn: () => nutritionApi.getGroup({ group_by: groupBy }),
  })
  const alertsQuery = useQuery({ queryKey: ['nutrition-alerts'], queryFn: () => nutritionApi.getAlerts() })

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}><StatCard title="平均热量" value={nutQuery.data?.avg_energy_kcal ?? 0} suffix="kcal" precision={1} /></Col>
        <Col span={6}><StatCard title="平均蛋白质" value={nutQuery.data?.avg_protein_g ?? 0} suffix="g" precision={1} /></Col>
        <Col span={6}><StatCard title="平均脂肪" value={nutQuery.data?.avg_fat_g ?? 0} suffix="g" precision={1} /></Col>
        <Col span={6}><StatCard title="预警人数" value={nutQuery.data?.alert_count ?? 0} suffix="人" /></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Tabs
            items={[
              {
                key: 'group',
                label: '群体对比',
                children: (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <Tag onClick={() => setGroupBy('department')} color={groupBy === 'department' ? 'blue' : 'default'}>按院系</Tag>
                      <Tag onClick={() => setGroupBy('grade')} color={groupBy === 'grade' ? 'blue' : 'default'}>按年级</Tag>
                    </div>
                    <Table
                      dataSource={groupQuery.data?.groups}
                      columns={[
                        { title: groupBy === 'department' ? '院系' : '年级', dataIndex: 'group_key', key: 'group_key' },
                        { title: '学生数', dataIndex: 'student_count', key: 'student_count' },
                        { title: '平均热量', dataIndex: 'avg_energy_kcal', key: 'avg_energy_kcal' },
                        { title: '平均蛋白质', dataIndex: 'avg_protein_g', key: 'avg_protein_g' },
                        { title: '平均脂肪', dataIndex: 'avg_fat_g', key: 'avg_fat_g' },
                        { title: '平均碳水', dataIndex: 'avg_carbs_g', key: 'avg_carbs_g' },
                      ]}
                      rowKey="group_key"
                      loading={groupQuery.isLoading}
                    />
                  </>
                ),
              },
              {
                key: 'alerts',
                label: '异常预警',
                children: (
                  <Table
                    dataSource={alertsQuery.data}
                    columns={[
                      { title: '院系', dataIndex: 'department', key: 'department' },
                      { title: '年级', dataIndex: 'grade', key: 'grade' },
                      { title: '详情', dataIndex: 'details', key: 'details' },
                    ]}
                    rowKey="student_hash"
                    loading={alertsQuery.isLoading}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  )
}