import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Input, Select, Button, Space, Tag, Image, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { dishApi, canteenApi } from '@/api/resources'
import type { DishResponse } from '@/types'

const { Title } = Typography

const categoryOptions = [
  { value: '热菜', label: '热菜' },
  { value: '主食', label: '主食' },
  { value: '饮品', label: '饮品' },
  { value: '小吃', label: '小吃' },
  { value: '面食', label: '面食' },
  { value: '套餐', label: '套餐' },
]

const DishListPage: React.FC = () => {
  const navigate = useNavigate()
  const [canteenId, setCanteenId] = useState<string>()
  const [category, setCategory] = useState<string>()
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const { data: canteens } = useQuery({
    queryKey: ['canteens'],
    queryFn: () => canteenApi.list(),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['dishes', { canteenId, category, keyword, page }],
    queryFn: () => dishApi.list({ window_id: canteenId, category, keyword, page, page_size: 12 }),
  })

  const columns = [
    {
      title: '餐品',
      key: 'dish',
      render: (_: any, record: DishResponse) => (
        <Space>
          <Image
            width={48}
            height={48}
            src={`https://picsum.photos/seed/${record.dish_id}/100/100`}
            style={{ borderRadius: 8, objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.dish_name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.dish_id}</div>
          </div>
        </Space>
      ),
    },
    { title: '窗口', dataIndex: 'window_name', key: 'window_name', sorter: (a: DishResponse, b: DishResponse) => (a.window_name ?? '').localeCompare(b.window_name ?? '') },
    {
      title: '分类', dataIndex: 'category', key: 'category',
      sorter: (a: DishResponse, b: DishResponse) => a.category.localeCompare(b.category),
      render: (c: string) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: DishResponse, b: DishResponse) => a.price - b.price,
      render: (p: number) => <span style={{ color: '#f5222d', fontWeight: 500 }}>¥{p.toFixed(2)}</span>,
    },
    {
      title: '供应',
      dataIndex: 'is_available',
      key: 'is_available',
      filters: [
        { text: '供应中', value: 1 },
        { text: '已售罄', value: 0 },
      ],
      onFilter: (value: any, record: DishResponse) => record.is_available === value,
      render: (a: number) => a === 1 ? <Tag color="success">供应中</Tag> : <Tag>已售罄</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DishResponse) => (
        <Button type="link" onClick={() => navigate(`/dishes/${record.dish_id}`)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <Card>
      <Title level={4}>餐品浏览</Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="选择食堂"
          allowClear
          style={{ width: 160 }}
          value={canteenId}
          onChange={setCanteenId}
          options={canteens?.map((c) => ({ value: c.canteen_id, label: c.name }))}
        />
        <Select
          placeholder="选择分类"
          allowClear
          style={{ width: 120 }}
          value={category}
          onChange={setCategory}
          options={categoryOptions}
        />
        <Input
          placeholder="搜索餐品"
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="dish_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 12,
          total: data?.meta?.total,
          onChange: setPage,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Card>
  )
}

export default DishListPage
