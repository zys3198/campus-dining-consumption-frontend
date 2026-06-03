import { useState } from 'react'
import { Card, Table, Tag } from 'antd'
import type { TablePaginationConfig } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { dishApi } from '@/api/resources'

export default function DishManagePage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dishes', page, pageSize],
    queryFn: () => dishApi.list({ page, page_size: pageSize }),
  })

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current)
    if (pagination.pageSize) setPageSize(pagination.pageSize)
  }

  return (
    <Card title="餐品管理">
      <Table
        dataSource={data?.data}
        columns={[
          { title: '餐品ID', dataIndex: 'dish_id', key: 'dish_id' },
          { title: '名称', dataIndex: 'dish_name', key: 'dish_name' },
          { title: '价格', dataIndex: 'price', key: 'price', render: (p: number) => `¥${p.toFixed(2)}` },
          { title: '分类', dataIndex: 'category', key: 'category', render: (c: string) => <Tag>{c}</Tag> },
          { title: '窗口', dataIndex: 'window_name', key: 'window_name' },
          { title: '状态', dataIndex: 'is_available', key: 'is_available', render: (a: number) => <Tag color={a === 1 ? 'green' : 'default'}>{a === 1 ? '在售' : '停售'}</Tag> },
        ]}
        rowKey="dish_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: data?.meta?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个餐品`,
        }}
        onChange={handleTableChange}
      />
    </Card>
  )
}
