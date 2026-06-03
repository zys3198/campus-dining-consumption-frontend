import { useState } from 'react'
import { Card, Table, Tag } from 'antd'
import type { TablePaginationConfig } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { windowApi } from '@/api/resources'

export default function WindowManagePage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-windows', page, pageSize],
    queryFn: () => windowApi.list({ page, page_size: pageSize }),
  })

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current)
    if (pagination.pageSize) setPageSize(pagination.pageSize)
  }

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
        pagination={{
          current: page,
          pageSize,
          total: data?.meta?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个窗口`,
        }}
        onChange={handleTableChange}
      />
    </Card>
  )
}
