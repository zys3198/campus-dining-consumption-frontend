import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, InputNumber, App, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { canteenApi } from '@/api/resources'
import { getErrorDetail } from '@/api/error'
import type { CanteenListResponse, CanteenCreate, CanteenUpdate } from '@/types'
import { buildFilters } from '@/utils/table'

interface FormValues {
  name: string
  location?: string
  floor?: number
}

export default function CanteenManagePage() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CanteenListResponse | null>(null)
  const [form] = Form.useForm<FormValues>()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-canteens'],
    queryFn: () => canteenApi.list(),
  })

  const createMut = useMutation({
    mutationFn: (values: CanteenCreate) => canteenApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-canteens'] })
      message.success('食堂创建成功')
      closeModal()
    },
    onError: (err: any) => message.error(getErrorDetail(err, '创建失败')),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CanteenUpdate }) => canteenApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-canteens'] })
      message.success('更新成功')
      closeModal()
    },
    onError: (err: any) => message.error(getErrorDetail(err, '更新失败')),
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => canteenApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-canteens'] })
      message.success('删除成功')
    },
    onError: (err: any) => message.error(getErrorDetail(err, '删除失败')),
  })

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: CanteenListResponse) => {
    setEditing(record)
    form.setFieldsValue({ name: record.name, location: record.location, floor: record.floor })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    const raw = await form.validateFields()
    // Ant Design Input 清空后返回空字符串/null，转为 undefined 让后端视为"未填写"
    const values = {
      ...raw,
      location: raw.location || undefined,
      floor: raw.floor ?? undefined,
    }
    if (editing) {
      updateMut.mutate({ id: editing.canteen_id, values })
    } else {
      createMut.mutate(values)
    }
  }

  return (
    <Card
      title="食堂管理"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增食堂</Button>}
    >
      <Table
        dataSource={data}
        columns={[
          { title: '食堂ID', dataIndex: 'canteen_id', key: 'canteen_id', sorter: (a, b) => a.canteen_id.localeCompare(b.canteen_id) },
          { title: '名称', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
          {
            title: '位置', dataIndex: 'location', key: 'location',
            filters: buildFilters(data ?? [], d => d.location),
            onFilter: (value, record) => record.location === value,
          },
          {
            title: '楼层', dataIndex: 'floor', key: 'floor',
            sorter: (a, b) => (a.floor ?? 0) - (b.floor ?? 0),
            filters: data ? [...new Set(data.map(d => d.floor))].filter((f): f is number => f != null).map(f => ({ text: `${f}F`, value: f })) : [],
            onFilter: (value, record) => record.floor === value,
          },
          { title: '窗口数', dataIndex: 'window_count', key: 'window_count', sorter: (a, b) => a.window_count - b.window_count },
          {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <>
                <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
                <Popconfirm
                  title="确认删除"
                  description={
                    record.window_count > 0
                      ? `该食堂下仍有 ${record.window_count} 个窗口，无法删除`
                      : `确定要删除「${record.name}」吗？此操作不可撤销。`
                  }
                  onConfirm={() => deleteMut.mutate(record.canteen_id)}
                  okText="删除"
                  cancelText="取消"
                  okButtonProps={{ danger: true, disabled: record.window_count > 0 }}
                >
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deleteMut.isPending && deleteMut.variables === record.canteen_id}
                    disabled={record.window_count > 0}
                  >
                    删除
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        rowKey="canteen_id"
        loading={isLoading}
      />

      <Modal
        title={editing ? '编辑食堂' : '新增食堂'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        confirmLoading={createMut.isPending || updateMut.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入食堂名称' }]}>
            <Input placeholder="请输入食堂名称" />
          </Form.Item>
          <Form.Item name="location" label="位置">
            <Input placeholder="请输入位置" />
          </Form.Item>
          <Form.Item name="floor" label="楼层">
            <InputNumber min={1} placeholder="请输入楼层" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
