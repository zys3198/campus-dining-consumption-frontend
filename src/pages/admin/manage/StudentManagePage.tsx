import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, App } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '@/api/resources'
import { getErrorDetail } from '@/api/error'
import type { StudentRecord, StudentUpdate } from '@/types'
import { buildFilters } from '@/utils/table'

interface FormValues {
  name: string
  department: string
  grade: string
}

export default function StudentManagePage() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<StudentRecord | null>(null)
  const [form] = Form.useForm<FormValues>()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-students', page, pageSize],
    queryFn: () => studentApi.list({ page, page_size: pageSize }),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: StudentUpdate }) => studentApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] })
      message.success('更新成功')
      closeModal()
    },
    onError: (err: any) => message.error(getErrorDetail(err, '更新失败')),
  })

  const openEdit = (record: StudentRecord) => {
    setEditing(record)
    form.setFieldsValue({
      name: record.name,
      department: record.department,
      grade: record.grade,
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
      updateMut.mutate({ id: editing.student_id, values })
    }
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current)
    if (pagination.pageSize) setPageSize(pagination.pageSize)
  }

  return (
    <Card title="学生管理">
      <Table
        dataSource={data?.data}
        columns={[
          { title: '学号', dataIndex: 'student_id', key: 'student_id', sorter: (a, b) => a.student_id.localeCompare(b.student_id) },
          { title: '姓名', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
          {
            title: '院系', dataIndex: 'department', key: 'department',
            sorter: (a, b) => a.department.localeCompare(b.department),
            filters: buildFilters(data?.data ?? [], d => d.department),
            onFilter: (value, record) => record.department === value,
          },
          {
            title: '年级', dataIndex: 'grade', key: 'grade',
            sorter: (a, b) => a.grade.localeCompare(b.grade),
            filters: buildFilters(data?.data ?? [], d => d.grade),
            onFilter: (value, record) => record.grade === value,
          },
          {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
            ),
          },
        ]}
        rowKey="student_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: data?.meta?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 名学生`,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title="编辑学生信息"
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        confirmLoading={updateMut.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item label="学号">
            <Input value={editing?.student_id} disabled />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="department" label="院系" rules={[{ required: true, message: '请输入院系' }]}>
            <Input placeholder="请输入院系" />
          </Form.Item>
          <Form.Item name="grade" label="年级" rules={[{ required: true, message: '请输入年级' }]}>
            <Input placeholder="请输入年级" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
