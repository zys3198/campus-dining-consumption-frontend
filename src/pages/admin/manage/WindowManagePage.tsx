import { Card, Table, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { windowApi } from '@/api/resources'

export default function WindowManagePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-windows'],
    queryFn: () => windowApi.list(),
  })

  return (
    <Card title="窗口管理">
      <Table
        dataSource={data?.data}
        columns={[
          { title: '窗口ID', dataIndex: 'window_id', key: 'window_id' },
          { title: '名称', dataIndex: 'window_name', key: 'window_name' },
          { title: '所属食堂', dataIndex: 'canteen_name', key: 'canteen_name' },
          { title: '类型', dataIndex: 'window_type', key: 'window_type' },
          { title: '状态', dataIndex: 'status', key: 'status', render: (s: number) => <Tag color={s === 1 ? 'green' : 'red'}>{s === 1 ? '营业中' : '已关闭'}</Tag> },
        ]}
        rowKey="window_id"
        loading={isLoading}
      />
    </Card>
  )
}
