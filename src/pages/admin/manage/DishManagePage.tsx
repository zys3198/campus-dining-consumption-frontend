import { Card, Table, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dishApi } from '@/api/resources'

export default function DishManagePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dishes'],
    queryFn: () => dishApi.list(),
  })

  return (
    <Card title="餐品管理">
      <Table
        dataSource={data?.data}
        columns={[
          { title: '餐品ID', dataIndex: 'dish_id', key: 'dish_id' },
          { title: '名称', dataIndex: 'dish_name', key: 'dish_name' },
          { title: '价格', dataIndex: 'price', key: 'price', render: (p: number) => `¥${(p / 100).toFixed(2)}` },
          { title: '分类', dataIndex: 'category', key: 'category', render: (c: string) => <Tag>{c}</Tag> },
          { title: '窗口', dataIndex: 'window_name', key: 'window_name' },
          { title: '状态', dataIndex: 'is_available', key: 'is_available', render: (a: number) => <Tag color={a === 1 ? 'green' : 'default'}>{a === 1 ? '在售' : '停售'}</Tag> },
        ]}
        rowKey="dish_id"
        loading={isLoading}
      />
    </Card>
  )
}
