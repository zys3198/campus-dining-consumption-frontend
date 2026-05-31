import { useState } from 'react'
import { Table, Card, DatePicker, Space } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { transactionApi } from '@/api/dashboard'
import type { TransactionResponse } from '@/types'

const { RangePicker } = DatePicker

const MEAL_NAMES = ['早餐', '午餐', '晚餐', '夜宵']

export default function TransactionListPage() {
  const [params, setParams] = useState({ page: 1, page_size: 20 })
  const [dates, setDates] = useState<[string | undefined, string | undefined]>([undefined, undefined])

  const { data, isLoading } = useQuery({
    queryKey: ['student-transactions', params, dates],
    queryFn: () => transactionApi.list({
      ...params,
      start_date: dates[0],
      end_date: dates[1],
    }),
  })

  const columns = [
    { title: '时间', dataIndex: 'txn_time', key: 'txn_time', render: (t: string) => new Date(t).toLocaleString() },
    { title: '窗口', dataIndex: 'window_name', key: 'window_name' },
    { title: '金额', dataIndex: 'total_amount', key: 'total_amount', render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '餐段', dataIndex: 'meal_type', key: 'meal_type', render: (m: number) => MEAL_NAMES[m - 1] || `餐段${m}` },
    { title: '餐品', dataIndex: 'dishes', key: 'dishes', render: (dishes: TransactionResponse['dishes']) => dishes?.map(d => d.dish_name).join(', ') || '-' },
  ]

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <RangePicker onChange={(dates) => {
          setDates([dates?.[0]?.format('YYYY-MM-DD'), dates?.[1]?.format('YYYY-MM-DD')])
          setParams(p => ({ ...p, page: 1 }))
        }} />
      </Space>
      <Table
        dataSource={data?.data}
        columns={columns}
        rowKey="txn_id"
        loading={isLoading}
        pagination={{
          current: params.page,
          pageSize: params.page_size,
          total: data?.meta?.total,
          onChange: (page, size) => setParams({ page, page_size: size }),
        }}
      />
    </Card>
  )
}