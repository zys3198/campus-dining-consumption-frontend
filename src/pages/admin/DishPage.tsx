import React, { useState } from 'react'
import { Card, Table, Button, Space, Input, Select, Modal, Form, message, Tag, Image } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dishApi, canteenApi } from '@/api/resources'
import { getErrorDetail } from '@/api/error'
import type { DishResponse } from '@/types'

const AdminDishPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingDish, setEditingDish] = useState<DishResponse | null>(null)
  const [form] = Form.useForm()

  const { data: canteens } = useQuery({
    queryKey: ['canteens'],
    queryFn: () => canteenApi.list(),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dishes', { page, keyword }],
    queryFn: () => dishApi.list({ keyword, page, page_size: 10 }),
  })

  const createMutation = useMutation({
    mutationFn: dishApi.create,
    onSuccess: () => { message.success('创建成功'); setModalVisible(false); queryClient.invalidateQueries({ queryKey: ['admin-dishes'] }) },
    onError: (err: any) => message.error(getErrorDetail(err, '创建失败')),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => dishApi.update(id, data),
    onSuccess: () => { message.success('更新成功'); setModalVisible(false); queryClient.invalidateQueries({ queryKey: ['admin-dishes'] }) },
    onError: (err: any) => message.error(getErrorDetail(err, '更新失败')),
  })

  const deleteMutation = useMutation({
    mutationFn: dishApi.delete,
    onSuccess: () => { message.success('删除成功'); queryClient.invalidateQueries({ queryKey: ['admin-dishes'] }) },
    onError: (err: any) => message.error(getErrorDetail(err, '删除失败')),
  })

  const columns = [
    {
      title: '餐品',
      key: 'dish',
      render: (_: any, record: DishResponse) => (
        <Space>
          <Image width={40} height={40} src={`https://picsum.photos/seed/${record.dish_id}/100/100`} style={{ borderRadius: 4 }} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
          <div>
            <div style={{ fontWeight: 500 }}>{record.dish_name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.dish_id}</div>
          </div>
        </Space>
      ),
    },
    { title: '窗口', dataIndex: 'window_name', key: 'window_name' },
    { title: '分类', dataIndex: 'category', key: 'category', render: (c: string) => <Tag color="blue">{c}</Tag> },
    { title: '价格', dataIndex: 'price', key: 'price', render: (p: number) => `¥${p.toFixed(2)}` },
    {
      title: '供应',
      dataIndex: 'is_available',
      key: 'is_available',
      render: (a: number) => a === 1 ? <Tag color="success">供应中</Tag> : <Tag>已售罄</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DishResponse) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => { setEditingDish(record); setModalVisible(true) }} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => deleteMutation.mutate(record.dish_id)} />
        </Space>
      ),
    },
  ]

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingDish) {
        updateMutation.mutate({ id: editingDish.dish_id, data: values })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  return (
    <Card
      title="餐品管理"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingDish(null); form.resetFields(); setModalVisible(true) }}>新增餐品</Button>}
    >
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="搜索餐品" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ width: 200 }} />
      </Space>

      <Table columns={columns} dataSource={data?.data} rowKey="dish_id" loading={isLoading} pagination={{ current: page, pageSize: 10, total: data?.meta?.total, onChange: setPage }} />

      <Modal title={editingDish ? '编辑餐品' : '新增餐品'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical" initialValues={editingDish || {}}>
          <Form.Item name="dish_id" label="餐品编号" rules={[{ required: true }]}>
            <Input disabled={!!editingDish} />
          </Form.Item>
          <Form.Item name="dish_name" label="餐品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="window_id" label="窗口" rules={[{ required: true }]}>
            <Select>
              {canteens?.map((c) => (
                <Select.Option key={c.canteen_id} value={c.canteen_id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select options={[{ value: '热菜' }, { value: '主食' }, { value: '饮品' }, { value: '小吃' }, { value: '面食' }, { value: '套餐' }]} />
          </Form.Item>
          <Form.Item name="is_available" label="供应状态" initialValue={1}>
            <Select options={[{ value: 1, label: '供应中' }, { value: 0, label: '已售罄' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}


export default AdminDishPage
