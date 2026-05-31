import React, { useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Tag } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { windowApi } from '@/api/resources'
import type { WindowResponse } from '@/types'

const AdminWindowPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingWindow, setEditingWindow] = useState<WindowResponse | null>(null)
  const [form] = Form.useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-windows', { page }],
    queryFn: () => windowApi.list({ page, page_size: 10 }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => windowApi.update(id, data),
    onSuccess: () => { message.success('更新成功'); setModalVisible(false); queryClient.invalidateQueries({ queryKey: ['admin-windows'] }) },
    onError: () => message.error('更新失败'),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) => windowApi.updateStatus(id, status),
    onSuccess: () => { message.success('状态更新成功'); queryClient.invalidateQueries({ queryKey: ['admin-windows'] }) },
    onError: () => message.error('更新失败'),
  })

  const columns = [
    { title: '窗口编号', dataIndex: 'window_id', key: 'window_id' },
    { title: '窗口名称', dataIndex: 'window_name', key: 'window_name' },
    { title: '所属食堂', dataIndex: 'canteen_name', key: 'canteen_name' },
    { title: '类型', dataIndex: 'window_type', key: 'window_type', render: (t: string) => <Tag>{t}</Tag> },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: number) => {
        const map = { 1: { color: 'success', text: '营业' }, 0: { color: 'warning', text: '暂停' }, [-1]: { color: 'error', text: '关闭' } }
        const style = map[s as keyof typeof map] || map[0]
        return <Tag color={style.color}>{style.text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WindowResponse) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => { setEditingWindow(record); form.setFieldsValue(record); setModalVisible(true) }} />
          {record.status === 1 ? (
            <Button size="small" onClick={() => statusMutation.mutate({ id: record.window_id, status: 0 })}>暂停</Button>
          ) : (
            <Button size="small" type="primary" onClick={() => statusMutation.mutate({ id: record.window_id, status: 1 })}>营业</Button>
          )}
        </Space>
      ),
    },
  ]

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      updateMutation.mutate({ id: editingWindow!.window_id, data: values })
    })
  }

  return (
    <Card title="窗口管理">
      <Table columns={columns} dataSource={data?.data} rowKey="window_id" loading={isLoading} pagination={{ current: page, pageSize: 10, total: data?.meta?.total, onChange: setPage }} />

      <Modal title="编辑窗口" open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="window_name" label="窗口名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="window_type" label="类型" rules={[{ required: true }]}>
            <Select options={[{ value: '自选' }, { value: '套餐' }, { value: '面食' }, { value: '小吃' }, { value: '饮品' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}


export default AdminWindowPage
