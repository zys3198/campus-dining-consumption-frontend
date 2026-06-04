import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Space, App, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, SwapOutlined, DeleteOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { windowApi, canteenApi } from '@/api/resources'
import { getErrorDetail } from '@/api/error'
import type { WindowResponse } from '@/types'
import { buildFilters, naturalCompare } from '@/utils/table'

interface FormValues {
  window_id: string
  window_name: string
  canteen_id: string
  window_type: string
}

export default function WindowManagePage() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<WindowResponse | null>(null)
  const [form] = Form.useForm<FormValues>()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-windows', page, pageSize],
    queryFn: () => windowApi.list({ page, page_size: pageSize }),
  })

  const canteenQuery = useQuery({
    queryKey: ['canteens-select'],
    queryFn: () => canteenApi.list(),
  })

  const createMut = useMutation({
    mutationFn: (values: Partial<WindowResponse>) => windowApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-windows'] })
      message.success('窗口创建成功')
      closeModal()
    },
    onError: (err: any) => message.error(getErrorDetail(err, '创建失败')),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<WindowResponse> }) => windowApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-windows'] })
      message.success('更新成功')
      closeModal()
    },
    onError: (err: any) => message.error(getErrorDetail(err, '更新失败')),
  })

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) => windowApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-windows'] })
      message.success('状态已切换')
    },
    onError: (err: any) => message.error(getErrorDetail(err, '状态切换失败')),
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => windowApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-windows'] })
      message.success('删除成功')
    },
    onError: (err: any) => message.error(getErrorDetail(err, '删除失败')),
  })

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: WindowResponse) => {
    setEditing(record)
    form.setFieldsValue({
      window_id: record.window_id,
      window_name: record.window_name,
      canteen_id: record.canteen_id,
      window_type: record.window_type,
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
      updateMut.mutate({ id: editing.window_id, values })
    } else {
      createMut.mutate(values)
    }
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current)
    if (pagination.pageSize) setPageSize(pagination.pageSize)
  }

  return (
    <Card
      title="窗口管理"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增窗口</Button>}
    >
      <Table
        dataSource={data?.data}
        columns={[
          { title: '窗口ID', dataIndex: 'window_id', key: 'window_id', sorter: (a, b) => naturalCompare(a.window_id, b.window_id) },
          { title: '名称', dataIndex: 'window_name', key: 'window_name', sorter: (a, b) => naturalCompare(a.window_name, b.window_name) },
          {
            title: '所属食堂', dataIndex: 'canteen_name', key: 'canteen_name',
            filters: buildFilters(data?.data ?? [], d => d.canteen_name),
            onFilter: (value, record) => record.canteen_name === value,
          },
          {
            title: '类型', dataIndex: 'window_type', key: 'window_type',
            sorter: (a, b) => naturalCompare(a.window_type, b.window_type),
            filters: buildFilters(data?.data ?? [], d => d.window_type),
            onFilter: (value, record) => record.window_type === value,
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            filters: [
              { text: '营业中', value: 1 },
              { text: '已关闭', value: 0 },
            ],
            onFilter: (value, record) => record.status === value,
            render: (s: number, record) => (
              <Space>
                <Tag color={s === 1 ? 'green' : 'red'}>{s === 1 ? '营业中' : '已关闭'}</Tag>
                <Button
                  size="small"
                  icon={<SwapOutlined />}
                  onClick={() => statusMut.mutate({ id: record.window_id, status: s === 1 ? 0 : 1 })}
                  loading={statusMut.isPending}
                />
              </Space>
            ),
          },
          {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <Space>
                <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
                <Popconfirm
                  title="确定删除此窗口？"
                  description="窗口下有餐品时无法删除"
                  onConfirm={() => deleteMut.mutate(record.window_id)}
                  okText="删除"
                  cancelText="取消"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deleteMut.isPending && deleteMut.variables === record.window_id}
                  >
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
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

      <Modal
        title={editing ? '编辑窗口' : '新增窗口'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        confirmLoading={createMut.isPending || updateMut.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item name="window_id" label="窗口ID" rules={editing ? [] : [
            { required: true, message: '请输入窗口ID' },
            { pattern: /^W\d+$/, message: '格式：W + 数字，如 W10' },
          ]}>
            <Input placeholder="如 W10、W032" disabled={!!editing} />
          </Form.Item>
          <Form.Item name="window_name" label="窗口名称" rules={[{ required: true, message: '请输入窗口名称' }]}>
            <Input placeholder="请输入窗口名称" />
          </Form.Item>
          <Form.Item name="canteen_id" label="所属食堂" rules={[{ required: true, message: '请选择食堂' }]}>
            <Select
              placeholder="请选择食堂"
              loading={canteenQuery.isLoading}
              options={canteenQuery.data?.map((c) => ({ label: c.name, value: c.canteen_id }))}
            />
          </Form.Item>
          <Form.Item name="window_type" label="窗口类型" rules={[{ required: true, message: '请输入窗口类型' }]}>
            <Input placeholder="如：中餐、面食、小吃" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
