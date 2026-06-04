import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, InputNumber, App } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { canteenApi } from '@/api/resources'
import type { CanteenListResponse, CanteenCreate, CanteenUpdate } from '@/types'

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
    onError: () => message.error('创建失败'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CanteenUpdate }) => canteenApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-canteens'] })
      message.success('更新成功')
      closeModal()
    },
    onError: () => message.error('更新失败'),
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
    const values = await form.validateFields()
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
          { title: '食堂ID', dataIndex: 'canteen_id', key: 'canteen_id' },
          { title: '名称', dataIndex: 'name', key: 'name' },
          { title: '位置', dataIndex: 'location', key: 'location' },
          { title: '楼层', dataIndex: 'floor', key: 'floor' },
          { title: '窗口数', dataIndex: 'window_count', key: 'window_count' },
          {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
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
