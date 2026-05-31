import React from 'react'
import { Card, Table } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { canteenApi } from '@/api/resources'

export default function CanteenManagePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-canteens'],
    queryFn: canteenApi.list,
  })

  return (
    <Card title="食堂管理">
      <Table
        dataSource={data}
        columns={[
          { title: '食堂ID', dataIndex: 'canteen_id', key: 'canteen_id' },
          { title: '名称', dataIndex: 'name', key: 'name' },
          { title: '位置', dataIndex: 'location', key: 'location' },
          { title: '楼层', dataIndex: 'floor', key: 'floor' },
          { title: '窗口数', dataIndex: 'window_count', key: 'window_count' },
        ]}
        rowKey="canteen_id"
        loading={isLoading}
      />
    </Card>
  )
}
