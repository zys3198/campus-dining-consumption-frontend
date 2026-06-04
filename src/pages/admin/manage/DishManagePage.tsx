import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, InputNumber, Select, Space, App, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dishApi, windowApi } from '@/api/resources'
import type { DishResponse, DishCreate, DishUpdate } from '@/types'

interface FormValues {
  dish_id: string
  dish_name: string
  window_id: string
  price: number
  category: string
  tags?: string
  is_available: number
}

export default function DishManagePage() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<DishResponse | null>(null)
  const [form] = Form.useForm<FormValues>()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dishes', page, pageSize],
    queryFn: () => dishApi.list({ page, page_size: pageSize }),
  })

  const windowQuery = useQuery({
    queryKey: ['windows-select'],
    queryFn: () => windowApi.list({ page_size: 200 }),
  })

  const createMut = useMutation({
    mutationFn: (values: DishCreate) => dishApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dishes'] })
      message.success('餐品创建成功')
      closeModal()
    },
    onError: () => message.error('创建失败'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: DishUpdate }) => dishApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dishes'] })
      message.success('更新成功')
      closeModal()
    },
    onError: () => message.error('更新失败'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => dishApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dishes'] })
      message.success('已删除')
    },
    onError: () => message.error('删除失败'),
  })

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: DishResponse) => {
    setEditing(record)
    form.setFieldsValue({
      dish_id: record.dish_id,
      dish_name: record.dish_name,
      window_id: record.window_id,
      price: record.price,
      category: record.category,
      tags: record.tags,
      is_available: record.is_available,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dish_id, ...updateData } = values
      updateMut.mutate({ id: editing.dish_id, values: updateData })
    } else {
      createMut.mutate(values as DishCreate)
    }
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current)
    if (pagination.pageSize) setPageSize(pagination.pageSize)
  }

  return (
    <Card
      title="餐品管理"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增餐品</Button>}
    >
      <Table
        dataSource={data?.data}
        columns={[
          { title: '餐品ID', dataIndex: 'dish_id', key: 'dish_id' },
          { title: '名称', dataIndex: 'dish_name', key: 'dish_name' },
          { title: '价格', dataIndex: 'price', key: 'price', render: (p: number) => `¥${p.toFixed(2)}` },
          { title: '分类', dataIndex: 'category', key: 'category', render: (c: string) => <Tag>{c}</Tag> },
          { title: '窗口', dataIndex: 'window_name', key: 'window_name' },
          {
            title: '状态',
            dataIndex: 'is_available',
            key: 'is_available',
            render: (a: number) => <Tag color={a === 1 ? 'green' : 'default'}>{a === 1 ? '在售' : '停售'}</Tag>,
          },
          {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <Space>
                <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
                <Popconfirm
                  title="确定删除此餐品？"
                  description="删除后不可恢复"
                  onConfirm={() => deleteMut.mutate(record.dish_id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                </Popconfirm>
              </Space>
            ),
          },
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

      <Modal
        title={editing ? '编辑餐品' : '新增餐品'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        confirmLoading={createMut.isPending || updateMut.isPending}
        destroyOnClose
        width={520}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item name="dish_id" label="餐品ID" rules={editing ? [] : [{ required: true, message: '请输入餐品ID' }]}>
            <Input placeholder="请输入餐品ID" disabled={!!editing} />
          </Form.Item>
          <Form.Item name="dish_name" label="餐品名称" rules={[{ required: true, message: '请输入餐品名称' }]}>
            <Input placeholder="请输入餐品名称" />
          </Form.Item>
          <Form.Item name="window_id" label="所属窗口" rules={[{ required: true, message: '请选择窗口' }]}>
            <Select
              placeholder="请选择窗口"
              loading={windowQuery.isLoading}
              showSearch
              optionFilterProp="label"
              options={windowQuery.data?.data?.map((w) => ({ label: `${w.window_name}（${w.canteen_name ?? ''}）`, value: w.window_id }))}
            />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber min={0} step={0.5} prefix="¥" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请输入分类' }]}>
            <Input placeholder="如：主食、小吃、饮品" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Input placeholder="如：辣、素食（逗号分隔）" />
          </Form.Item>
          <Form.Item name="is_available" label="状态" initialValue={1}>
            <Select options={[{ label: '在售', value: 1 }, { label: '停售', value: 0 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
