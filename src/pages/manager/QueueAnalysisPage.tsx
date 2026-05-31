import { Card, Table, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

const levelColor: Record<string, string> = { '畅通': 'green', '普通': 'blue', '拥堵': 'orange', '严重': 'red' }

export default function QueueAnalysisPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['operations-dashboard'],
    queryFn: dashboardApi.operations,
  })

  return (
    <Card title="窗口排队分析">
      <Table
        dataSource={data?.congestion}
        columns={[
          { title: '窗口名', dataIndex: 'window_name', key: 'window_name' },
          { title: '食堂', dataIndex: 'canteen_name', key: 'canteen_name' },
          { title: '状态', dataIndex: 'level', key: 'level', render: (level: string) => <Tag color={levelColor[level] || 'default'}>{level}</Tag> },
          { title: '平均等待(s)', dataIndex: 'avg_wait_seconds', key: 'avg_wait_seconds' },
          { title: '最大排队', dataIndex: 'max_queue_length', key: 'max_queue_length' },
          { title: '样本数', dataIndex: 'sample_count', key: 'sample_count' },
        ]}
        rowKey="window_id"
        loading={isLoading}
      />
    </Card>
  )
}